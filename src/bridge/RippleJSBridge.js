// @flow
import invariant from 'invariant'
import { BigNumber } from 'bignumber.js'
import { Observable } from 'rxjs'
import React from 'react'
import bs58check from 'ripple-bs58check'
import { computeBinaryTransactionHash } from 'ripple-hashes'
import throttle from 'lodash/throttle'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import { getDerivations } from 'helpers/derivations'
import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'
import {
  apiForEndpointConfig,
  defaultEndpoint,
  parseAPIValue,
  parseAPICurrencyObject,
  formatAPICurrencyXRP,
} from 'api/Ripple'
import FeesRippleKind from 'components/FeesField/RippleKind'
import AdvancedOptionsRippleKind from 'components/AdvancedOptions/RippleKind'
import { getAccountPlaceholderName, getNewAccountPlaceholderName } from 'helpers/accountName'
import { createCustomErrorClass } from 'helpers/errors'
import type { WalletBridge, EditProps } from './types'

const NotEnoughBalance = createCustomErrorClass('NotEnoughBalance')

type Transaction = {
  amount: BigNumber,
  recipient: string,
  fee: BigNumber,
  tag: ?number,
}

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesRippleKind
    onChange={fee => {
      onChange({ ...value, fee })
    }}
    fee={value.fee}
    account={account}
  />
)

const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptionsRippleKind
    tag={value.tag}
    onChangeTag={tag => {
      onChange({ ...value, tag })
    }}
  />
)

async function signAndBroadcast({ a, t, deviceId, isCancelled, onSigned, onOperationBroadcasted }) {
  const api = apiForEndpointConfig(a.endpointConfig)
  try {
    await api.connect()
    const amount = formatAPICurrencyXRP(t.amount)
    const payment = {
      source: {
        address: a.freshAddress,
        amount,
      },
      destination: {
        address: t.recipient,
        minAmount: amount,
        tag: t.tag,
      },
    }
    const instruction = {
      fee: formatAPICurrencyXRP(t.fee).value,
      maxLedgerVersionOffset: 12,
    }

    const prepared = await api.preparePayment(a.freshAddress, payment, instruction)

    const transaction = await signTransaction
      .send({
        currencyId: a.currency.id,
        devicePath: deviceId,
        path: a.freshAddressPath,
        transaction: JSON.parse(prepared.txJSON),
      })
      .toPromise()

    if (!isCancelled()) {
      onSigned()
      const submittedPayment = await api.submit(transaction)

      if (submittedPayment.resultCode !== 'tesSUCCESS') {
        throw new Error(submittedPayment.resultMessage)
      }

      const hash = computeBinaryTransactionHash(transaction)

      onOperationBroadcasted({
        id: `${a.id}-${hash}-OUT`,
        hash,
        accountId: a.id,
        type: 'OUT',
        value: t.amount,
        fee: t.fee,
        blockHash: null,
        blockHeight: null,
        senders: [a.freshAddress],
        recipients: [t.recipient],
        date: new Date(),
        // we probably can't get it so it's a predictive value
        transactionSequenceNumber:
          (a.operations.length > 0 ? a.operations[0].transactionSequenceNumber : 0) +
          a.pendingOperations.length,
      })
    }
  } finally {
    api.disconnect()
  }
}

function isRecipientValid(currency, recipient) {
  try {
    bs58check.decode(recipient)
    return true
  } catch (e) {
    return false
  }
}

function mergeOps(existing: Operation[], newFetched: Operation[]) {
  const ids = existing.map(o => o.id)
  const all = existing.concat(newFetched.filter(o => !ids.includes(o.id)))
  return all.sort((a, b) => b.date - a.date)
}

type Tx = {
  type: string,
  address: string,
  sequence: number,
  id: string,
  specification: {
    source: {
      address: string,
      maxAmount: {
        currency: string,
        value: string,
      },
    },
    destination: {
      address: string,
      amount: {
        currency: string,
        value: string,
      },
    },
    paths: string,
  },
  outcome: {
    result: string,
    fee: string,
    timestamp: string,
    deliveredAmount?: {
      currency: string,
      value: string,
      counterparty: string,
    },
    balanceChanges: {
      [addr: string]: Array<{
        counterparty: string,
        currency: string,
        value: string,
      }>,
    },
    orderbookChanges: {
      [addr: string]: Array<{
        direction: string,
        quantity: {
          currency: string,
          value: string,
        },
        totalPrice: {
          currency: string,
          counterparty: string,
          value: string,
        },
        makeExchangeRate: string,
        sequence: number,
        status: string,
      }>,
    },
    ledgerVersion: number,
    indexInLedger: number,
  },
}

const txToOperation = (account: Account) => ({
  id,
  sequence,
  outcome: { fee, deliveredAmount, ledgerVersion, timestamp },
  specification: { source, destination },
}: Tx): ?Operation => {
  const type = source.address === account.freshAddress ? 'OUT' : 'IN'
  let value = deliveredAmount ? parseAPICurrencyObject(deliveredAmount) : BigNumber(0)
  const feeValue = parseAPIValue(fee)
  if (type === 'OUT') {
    if (!isNaN(feeValue)) {
      value = value.plus(feeValue)
    }
  }

  const op: $Exact<Operation> = {
    id,
    hash: id,
    accountId: account.id,
    type,
    value,
    fee: feeValue,
    blockHash: null,
    blockHeight: ledgerVersion,
    senders: [source.address],
    recipients: [destination.address],
    date: new Date(timestamp),
    transactionSequenceNumber: sequence,
  }
  return op
}

const getServerInfo = (map => endpointConfig => {
  if (!endpointConfig) endpointConfig = ''
  if (map[endpointConfig]) return map[endpointConfig]()
  const f = throttle(async () => {
    const api = apiForEndpointConfig(endpointConfig)
    try {
      await api.connect()
      const res = await api.getServerInfo()
      return res
    } catch (e) {
      f.cancel()
      throw e
    } finally {
      api.disconnect()
    }
  }, 60000)
  map[endpointConfig] = f
  return f()
})({})

const RippleJSBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice: (currency, deviceId) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }

      async function main() {
        const api = apiForEndpointConfig()
        try {
          await api.connect()
          const serverInfo = await getServerInfo()
          const ledgers = serverInfo.completeLedgers.split('-')
          const minLedgerVersion = Number(ledgers[0])
          const maxLedgerVersion = Number(ledgers[1])

          const derivations = getDerivations(currency)
          for (const derivation of derivations) {
            const legacy = derivation !== derivations[derivations.length - 1]
            for (let index = 0; index < 255; index++) {
              const freshAddressPath = derivation({ currency, x: index, segwit: false })
              const { address, publicKey } = await await getAddress
                .send({ currencyId: currency.id, devicePath: deviceId, path: freshAddressPath })
                .toPromise()
              if (finished) return

              const accountId = `ripplejs:${currency.id}:${address}:${publicKey}`

              let info
              try {
                info = await api.getAccountInfo(address)
              } catch (e) {
                if (e.message !== 'actNotFound') {
                  throw e
                }
              }

              // fresh address is address. ripple never changes.
              const freshAddress = address

              if (!info) {
                // account does not exist in Ripple server
                // we are generating a new account locally
                if (!legacy) {
                  o.next({
                    id: accountId,
                    xpub: '',
                    name: getNewAccountPlaceholderName(currency, index),
                    freshAddress,
                    freshAddressPath,
                    balance: BigNumber(0),
                    blockHeight: maxLedgerVersion,
                    index,
                    currency,
                    operations: [],
                    pendingOperations: [],
                    unit: currency.units[0],
                    archived: false,
                    lastSyncDate: new Date(),
                  })
                }
                break
              }

              if (finished) return
              const balance = parseAPIValue(info.xrpBalance)
              invariant(
                !balance.isNaN() && balance.isFinite(),
                `Ripple: invalid balance=${balance.toString()} for address ${address}`,
              )

              const transactions = await api.getTransactions(address, {
                minLedgerVersion,
                maxLedgerVersion,
                types: ['payment'],
              })
              if (finished) return

              const account: $Exact<Account> = {
                id: accountId,
                xpub: '',
                name: getAccountPlaceholderName(currency, index, legacy),
                freshAddress,
                freshAddressPath,
                balance,
                blockHeight: maxLedgerVersion,
                index,
                currency,
                operations: [],
                pendingOperations: [],
                unit: currency.units[0],
                lastSyncDate: new Date(),
              }
              account.operations = transactions.map(txToOperation(account)).filter(Boolean)
              o.next(account)
            }
          }
          o.complete()
        } catch (e) {
          o.error(e)
        } finally {
          api.disconnect()
        }
      }

      main()

      return unsubscribe
    }),

  synchronize: ({
    endpointConfig,
    freshAddress,
    blockHeight,
    operations: { length: currentOpsLength },
  }) =>
    Observable.create(o => {
      let finished = false
      const unsubscribe = () => {
        finished = true
      }

      async function main() {
        const api = apiForEndpointConfig(endpointConfig)
        try {
          await api.connect()
          if (finished) return
          const serverInfo = await getServerInfo(endpointConfig)
          if (finished) return
          const ledgers = serverInfo.completeLedgers.split('-')
          const minLedgerVersion = Number(ledgers[0])
          const maxLedgerVersion = Number(ledgers[1])

          let info
          try {
            info = await api.getAccountInfo(freshAddress)
          } catch (e) {
            if (e.message !== 'actNotFound') {
              throw e
            }
          }
          if (finished) return

          if (!info) {
            // account does not exist, we have nothing to sync
            o.complete()
            return
          }

          const balance = parseAPIValue(info.xrpBalance)
          invariant(
            !balance.isNaN() && balance.isFinite(),
            `Ripple: invalid balance=${balance.toString()} for address ${freshAddress}`,
          )

          o.next(a => ({ ...a, balance }))

          const transactions = await api.getTransactions(freshAddress, {
            minLedgerVersion: Math.max(
              currentOpsLength === 0 ? 0 : blockHeight, // if there is no ops, it might be after a clear and we prefer to pull from the oldest possible history
              minLedgerVersion,
            ),
            maxLedgerVersion,
            types: ['payment'],
          })

          if (finished) return

          o.next(a => {
            const newOps = transactions.map(txToOperation(a))
            const operations = mergeOps(a.operations, newOps)
            const [last] = operations
            const pendingOperations = a.pendingOperations.filter(
              o =>
                !operations.some(op => o.hash === op.hash) &&
                last &&
                last.transactionSequenceNumber &&
                o.transactionSequenceNumber &&
                o.transactionSequenceNumber > last.transactionSequenceNumber,
            )
            return {
              ...a,
              operations,
              pendingOperations,
              blockHeight: maxLedgerVersion,
              lastSyncDate: new Date(),
            }
          })

          o.complete()
        } catch (e) {
          o.error(e)
        } finally {
          api.disconnect()
        }
      }

      main()

      return unsubscribe
    }),

  pullMoreOperations: () => Promise.resolve(a => a), // FIXME not implemented

  isRecipientValid: (currency, recipient) => Promise.resolve(isRecipientValid(currency, recipient)),
  getRecipientWarning: () => Promise.resolve(null),

  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: '',
    fee: BigNumber(0),
    tag: undefined,
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

  EditFees,

  EditAdvancedOptions,

  getTransactionRecipient: (a, t) => t.recipient,

  isValidTransaction: (a, t) => (!t.amount.isZero() && t.recipient && true) || false,

  checkCanBeSpent: async (a, t) => {
    const r = await getServerInfo(a.endpointConfig)
    if (
      t.amount
        .plus(t.fee)
        .plus(parseAPIValue(r.validatedLedger.reserveBaseXRP))
        .isLessThanOrEqualTo(a.balance)
    ) {
      return
    }
    throw new NotEnoughBalance()
  },

  getTotalSpent: (a, t) => Promise.resolve(t.amount.plus(t.fee)),

  getMaxAmount: (a, t) => Promise.resolve(a.balance.minus(t.fee)),

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

  getDefaultEndpointConfig: () => defaultEndpoint,

  validateEndpointConfig: async endpointConfig => {
    const api = apiForEndpointConfig(endpointConfig)
    await api.connect()
  },
}

export default RippleJSBridge
