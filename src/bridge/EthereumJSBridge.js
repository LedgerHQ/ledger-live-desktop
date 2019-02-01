// @flow
import { Observable } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import logger from 'logger'
import React from 'react'
import FeesField from 'components/FeesField/EthereumKind'
import AdvancedOptions from 'components/AdvancedOptions/EthereumKind'
import throttle from 'lodash/throttle'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
import {
  getDerivationModesForCurrency,
  getDerivationScheme,
  runDerivationScheme,
  isIterableDerivationMode,
  derivationModeSupportsIndex,
  getMandatoryEmptyAccountSkip,
} from '@ledgerhq/live-common/lib/derivation'
import {
  getAccountPlaceholderName,
  getNewAccountPlaceholderName,
} from '@ledgerhq/live-common/lib/account'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import eip55 from 'eip55'
import { apiForCurrency } from '@ledgerhq/live-common/lib/api/Ethereum'
import type { Tx } from '@ledgerhq/live-common/lib/api/Ethereum'
import getAddressCommand from 'commands/getAddress'
import signTransactionCommand from 'commands/signTransaction'
import { NotEnoughBalance, FeeNotLoaded, ETHAddressNonEIP } from '@ledgerhq/errors'
import type { EditProps, WalletBridge } from './types'

type Transaction = {
  recipient: string,
  amount: BigNumber,
  gasPrice: ?BigNumber,
  gasLimit: BigNumber,
}

const serializeTransaction = t => ({
  recipient: t.recipient,
  amount: `0x${BigNumber(t.amount).toString(16)}`,
  gasPrice: !t.gasPrice ? '0x00' : `0x${BigNumber(t.gasPrice).toString(16)}`,
  gasLimit: `0x${BigNumber(t.gasLimit).toString(16)}`,
})

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesField
    onChange={gasPrice => {
      onChange({ ...value, gasPrice })
    }}
    gasPrice={value.gasPrice}
    account={account}
  />
)

const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptions
    gasLimit={value.gasLimit}
    onChangeGasLimit={gasLimit => {
      onChange({ ...value, gasLimit })
    }}
  />
)

// in case of a SELF send, 2 ops are returned.
const txToOps = (account: Account) => (tx: Tx): Operation[] => {
  const freshAddress = account.freshAddress.toLowerCase()
  const from = tx.from.toLowerCase()
  const to = tx.to.toLowerCase()
  const sending = freshAddress === from
  const receiving = freshAddress === to
  const ops = []
  // FIXME problem with our api, precision lost here...
  const value = BigNumber(tx.value)
  const fee = BigNumber(tx.gas_price * tx.gas_used)
  if (sending) {
    const op: $Exact<Operation> = {
      id: `${account.id}-${tx.hash}-OUT`,
      hash: tx.hash,
      type: 'OUT',
      value: value.plus(fee),
      fee,
      blockHeight: tx.block && tx.block.height,
      blockHash: tx.block && tx.block.hash,
      accountId: account.id,
      senders: [tx.from],
      recipients: [tx.to],
      date: new Date(tx.received_at),
      extra: {},
    }
    ops.push(op)
  }
  if (receiving) {
    const op: $Exact<Operation> = {
      id: `${account.id}-${tx.hash}-IN`,
      hash: tx.hash,
      type: 'IN',
      value,
      fee,
      blockHeight: tx.block && tx.block.height,
      blockHash: tx.block && tx.block.hash,
      accountId: account.id,
      senders: [tx.from],
      recipients: [tx.to],
      date: new Date(new Date(tx.received_at) + 1), // hack: make the IN appear after the OUT in history.
      extra: {},
    }
    ops.push(op)
  }
  return ops
}

function isRecipientValid(currency, recipient) {
  if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return false

  // To handle non-eip55 addresses we stop validation here if we detect
  // address is either full upper or full lower.
  // see https://github.com/LedgerHQ/ledger-live-desktop/issues/1397
  const slice = recipient.substr(2)
  const isFullUpper = slice === slice.toUpperCase()
  const isFullLower = slice === slice.toLowerCase()
  if (isFullUpper || isFullLower) return true

  try {
    return eip55.verify(recipient)
  } catch (error) {
    return false
  }
}

// Returns a warning if we detect a non-eip address
function getRecipientWarning(currency, recipient) {
  if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return null
  const slice = recipient.substr(2)
  const isFullUpper = slice === slice.toUpperCase()
  const isFullLower = slice === slice.toLowerCase()
  if (isFullUpper || isFullLower) {
    return new ETHAddressNonEIP()
  }
  return null
}

function mergeOps(existing: Operation[], newFetched: Operation[]) {
  const ids = newFetched.map(o => o.id)
  const all = newFetched.concat(existing.filter(o => !ids.includes(o.id)))
  return uniqBy(all.sort((a, b) => b.date - a.date), 'id')
}

const signAndBroadcast = async ({
  a,
  t,
  deviceId,
  isCancelled,
  onSigned,
  onOperationBroadcasted,
}) => {
  const { gasPrice, amount, gasLimit } = t
  if (!gasPrice) throw new FeeNotLoaded()
  const api = apiForCurrency(a.currency)

  const nonce = await api.getAccountNonce(a.freshAddress)

  const transaction = await signTransactionCommand
    .send({
      currencyId: a.currency.id,
      devicePath: deviceId,
      path: a.freshAddressPath,
      transaction: { ...serializeTransaction(t), nonce },
    })
    .toPromise()

  if (!isCancelled()) {
    onSigned()

    const hash = await api.broadcastTransaction(transaction)

    const op: $Exact<Operation> = {
      id: `${a.id}-${hash}-OUT`,
      hash,
      type: 'OUT',
      value: amount,
      fee: gasPrice.times(gasLimit),
      blockHeight: null,
      blockHash: null,
      accountId: a.id,
      senders: [a.freshAddress],
      recipients: [t.recipient],
      transactionSequenceNumber: nonce,
      date: new Date(),
      extra: {},
    }

    onOperationBroadcasted(op)
  }
}

const SAFE_REORG_THRESHOLD = 80

const fetchCurrentBlock = (perCurrencyId => currency => {
  if (perCurrencyId[currency.id]) return perCurrencyId[currency.id]()
  const api = apiForCurrency(currency)
  const f = throttle(
    () =>
      api.getCurrentBlock().catch(e => {
        f.cancel()
        throw e
      }),
    5000,
  )
  perCurrencyId[currency.id] = f
  return f()
})({})

const EthereumBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice: (currency, deviceId) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }
      const api = apiForCurrency(currency)

      // in future ideally what we want is:
      // return mergeMap(addressesObservable, address => fetchAccount(address))

      let newAccountCount = 0

      async function stepAddress(
        index,
        { address, path: freshAddressPath },
        derivationMode,
        shouldSkipEmpty,
      ): { account?: Account, complete?: boolean } {
        const balance = await api.getAccountBalance(address)
        if (finished) return { complete: true }
        const currentBlock = await fetchCurrentBlock(currency)
        if (finished) return { complete: true }
        let { txs } = await api.getTransactions(address)
        if (finished) return { complete: true }

        const freshAddress = address
        const accountId = `ethereumjs:2:${currency.id}:${address}:${derivationMode}`

        if (txs.length === 0 && balance.isZero()) {
          // this is an empty account
          if (derivationMode === '') {
            // is standard derivation
            if (newAccountCount === 0) {
              // first zero account will emit one account as opportunity to create a new account..
              const account: $Exact<Account> = {
                id: accountId,
                seedIdentifier: freshAddress,
                freshAddress,
                freshAddressPath,
                derivationMode,
                name: getNewAccountPlaceholderName({ currency, index, derivationMode }),
                balance,
                blockHeight: currentBlock.height,
                index,
                currency,
                operations: [],
                pendingOperations: [],
                unit: currency.units[0],
                lastSyncDate: new Date(),
              }
              return { account, complete: true }
            }
            newAccountCount++
          }

          if (shouldSkipEmpty) {
            return {}
          }
          // NB for legacy addresses maybe we will continue at least for the first 10 addresses
          return { complete: true }
        }

        const account: $Exact<Account> = {
          id: accountId,
          seedIdentifier: freshAddress,
          freshAddress,
          freshAddressPath,
          derivationMode,
          name: getAccountPlaceholderName({ currency, index, derivationMode }),
          balance,
          blockHeight: currentBlock.height,
          index,
          currency,
          operations: [],
          pendingOperations: [],
          unit: currency.units[0],
          lastSyncDate: new Date(),
        }
        for (let i = 0; i < 50; i++) {
          const api = apiForCurrency(account.currency)
          const last = txs[txs.length - 1]
          if (!last) break
          const { block } = last
          if (!block) break
          const next = await api.getTransactions(account.freshAddress, block.hash)
          if (next.txs.length === 0) break
          txs = txs.concat(next.txs)
        }
        txs.reverse()
        account.operations = mergeOps([], flatMap(txs, txToOps(account)))
        return { account }
      }

      async function main() {
        try {
          const derivationModes = getDerivationModesForCurrency(currency)
          for (const derivationMode of derivationModes) {
            let emptyCount = 0
            const mandatoryEmptyAccountSkip = getMandatoryEmptyAccountSkip(derivationMode)
            const derivationScheme = getDerivationScheme({ derivationMode, currency })
            const stopAt = isIterableDerivationMode(derivationMode) ? 255 : 1
            for (let index = 0; index < stopAt; index++) {
              if (!derivationModeSupportsIndex(derivationMode, index)) continue
              const freshAddressPath = runDerivationScheme(derivationScheme, currency, {
                account: index,
              })
              const res = await getAddressCommand
                .send({ currencyId: currency.id, devicePath: deviceId, path: freshAddressPath })
                .toPromise()
              const r = await stepAddress(
                index,
                res,
                derivationMode,
                emptyCount < mandatoryEmptyAccountSkip,
              )
              logger.log(
                `scanning ${currency.id} at ${freshAddressPath}: ${res.address} resulted of ${
                  r.account ? `Account with ${r.account.operations.length} txs` : 'no account'
                }. ${r.complete ? 'ALL SCANNED' : ''}`,
              )
              if (r.account) {
                o.next(r.account)
              } else {
                emptyCount++
              }
              if (r.complete) {
                break
              }
            }
          }
          o.complete()
        } catch (e) {
          o.error(e)
        }
      }

      main()

      return unsubscribe
    }),

  synchronize: ({ freshAddress, blockHeight, currency, operations }) =>
    Observable.create(o => {
      let unsubscribed = false
      const api = apiForCurrency(currency)
      async function main() {
        try {
          const block = await fetchCurrentBlock(currency)
          if (unsubscribed) return
          if (block.height === blockHeight) {
            o.complete()
          } else {
            const filterConfirmedOperations = o =>
              o.blockHeight && blockHeight - o.blockHeight > SAFE_REORG_THRESHOLD

            operations = operations.filter(filterConfirmedOperations)
            const blockHash = operations.length > 0 ? operations[0].blockHash : undefined
            const { txs } = await api.getTransactions(freshAddress, blockHash)
            if (unsubscribed) return
            const balance = await api.getAccountBalance(freshAddress)
            if (unsubscribed) return
            if (txs.length === 0) {
              o.next(a => ({
                ...a,
                balance,
                blockHeight: block.height,
                lastSyncDate: new Date(),
              }))
              o.complete()
              return
            }
            const nonce = await api.getAccountNonce(freshAddress)
            if (unsubscribed) return
            o.next(a => {
              const currentOps = a.operations.filter(filterConfirmedOperations)
              const newOps = flatMap(txs, txToOps(a))
              const operations = mergeOps(currentOps, newOps)
              const pendingOperations = a.pendingOperations.filter(
                o =>
                  o.transactionSequenceNumber &&
                  o.transactionSequenceNumber >= nonce &&
                  !operations.some(op => o.hash === op.hash),
              )
              return {
                ...a,
                pendingOperations,
                operations,
                balance,
                blockHeight: block.height,
                lastSyncDate: new Date(),
              }
            })
            o.complete()
          }
        } catch (e) {
          o.error(e)
        }
      }
      main()

      return () => {
        unsubscribed = true
      }
    }),

  pullMoreOperations: () => Promise.resolve(a => a), // NOT IMPLEMENTED

  isRecipientValid: (currency, recipient) => Promise.resolve(isRecipientValid(currency, recipient)),
  getRecipientWarning: (currency, recipient) =>
    Promise.resolve(getRecipientWarning(currency, recipient)),

  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: '',
    gasPrice: null,
    gasLimit: BigNumber(0x5208),
  }),

  editTransactionAmount: (account, t, amount) => ({
    ...t,
    amount,
  }),

  getTransactionAmount: (a, t) => t.amount,

  editTransactionRecipient: (account, t, recipient) => ({
    ...t,
    recipient,
  }),

  getTransactionRecipient: (a, t) => t.recipient,

  EditFees,

  EditAdvancedOptions,

  checkValidTransaction: (a, t) =>
    !t.gasPrice
      ? Promise.reject(new FeeNotLoaded())
      : t.amount.isLessThanOrEqualTo(a.balance)
        ? Promise.resolve(true)
        : Promise.reject(new NotEnoughBalance()),

  getTotalSpent: (a, t) =>
    t.amount.isGreaterThan(0) &&
    t.gasPrice &&
    t.gasPrice.isGreaterThan(0) &&
    t.gasLimit.isGreaterThan(0)
      ? Promise.resolve(t.amount.plus(t.gasPrice.times(t.gasLimit)))
      : Promise.resolve(BigNumber(0)),

  getMaxAmount: (a, t) =>
    Promise.resolve(a.balance.minus((t.gasPrice || BigNumber(0)).times(t.gasLimit))),

  signAndBroadcast: (a, t, deviceId) =>
    Observable.create(o => {
      let cancelled = false
      const isCancelled = () => cancelled
      const onSigned = () => {
        o.next({ type: 'signed' })
      }
      const onOperationBroadcasted = operation => {
        o.next({ type: 'broadcasted', operation })
      }
      signAndBroadcast({ a, t, deviceId, isCancelled, onSigned, onOperationBroadcasted }).then(
        () => {
          o.complete()
        },
        e => {
          o.error(e)
        },
      )
      return () => {
        cancelled = true
      }
    }),

  addPendingOperation: (account, operation) => ({
    ...account,
    pendingOperations: [operation].concat(
      account.pendingOperations.filter(
        o => o.transactionSequenceNumber === operation.transactionSequenceNumber,
      ),
    ),
  }),
}

export default EthereumBridge
