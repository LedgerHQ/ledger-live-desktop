// @flow
import React from 'react'
import FeesField from 'components/FeesField/EthereumKind'
import AdvancedOptions from 'components/AdvancedOptions/EthereumKind'
import throttle from 'lodash/throttle'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import { apiForCurrency } from 'api/Ethereum'
import type { Tx } from 'api/Ethereum'
import { getDerivations } from 'helpers/derivations'
import getAddressCommand from 'commands/getAddress'
import signTransactionCommand from 'commands/signTransaction'
import type { EditProps, WalletBridge } from './types'

// TODO in future it would be neat to support eip55

type Transaction = {
  amount: number,
  recipient: string,
  gasPrice: number,
  gasLimit: number,
}

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
    onChange={gasLimit => {
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
  const fee = tx.gas_price * tx.gas_used
  if (sending) {
    ops.push({
      id: `${account.id}-${tx.hash}-OUT`,
      hash: tx.hash,
      type: 'OUT',
      value: tx.value,
      fee,
      blockHeight: tx.block && tx.block.height,
      blockHash: tx.block && tx.block.hash,
      accountId: account.id,
      senders: [tx.from],
      recipients: [tx.to],
      date: new Date(tx.received_at),
    })
  }
  if (receiving) {
    ops.push({
      id: `${account.id}-${tx.hash}-IN`,
      hash: tx.hash,
      type: 'IN',
      value: tx.value,
      fee,
      blockHeight: tx.block && tx.block.height,
      blockHash: tx.block && tx.block.hash,
      accountId: account.id,
      senders: [tx.from],
      recipients: [tx.to],
      date: new Date(new Date(tx.received_at) + 1), // hack: make the IN appear after the OUT in history.
    })
  }
  return ops
}

function isRecipientValid(currency, recipient) {
  return !!recipient.match(/^0x[0-9a-fA-F]{40}$/)
}

function mergeOps(existing: Operation[], newFetched: Operation[]) {
  const ids = newFetched.map(o => o.id)
  const all = newFetched.concat(existing.filter(o => !ids.includes(o.id)))
  return uniqBy(all.sort((a, b) => b.date - a.date), 'id')
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
  scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
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
      isStandard,
    ): { account?: Account, complete?: boolean } {
      const balance = await api.getAccountBalance(address)
      if (finished) return { complete: true }
      const currentBlock = await fetchCurrentBlock(currency)
      if (finished) return { complete: true }
      let { txs } = await api.getTransactions(address)
      if (finished) return { complete: true }

      const freshAddress = address
      const accountId = `ethereumjs:${currency.id}:${address}`

      if (txs.length === 0) {
        // this is an empty account
        if (isStandard) {
          if (newAccountCount === 0) {
            // first zero account will emit one account as opportunity to create a new account..
            const account: $Exact<Account> = {
              id: accountId,
              xpub: '',
              freshAddress,
              freshAddressPath,
              name: 'New Account',
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
        // NB for legacy addresses maybe we will continue at least for the first 10 addresses
        return { complete: true }
      }

      const account: $Exact<Account> = {
        id: accountId,
        xpub: '',
        freshAddress,
        freshAddressPath,
        name: address.slice(32),
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
        const { block } = txs[txs.length - 1]
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
        const derivations = getDerivations(currency)
        const last = derivations[derivations.length - 1]
        for (const derivation of derivations) {
          const isStandard = last === derivation
          for (let index = 0; index < 255; index++) {
            const freshAddressPath = derivation({ currency, x: index, segwit: false })
            const res = await getAddressCommand
              .send({ currencyId: currency.id, devicePath: deviceId, path: freshAddressPath })
              .toPromise()
            const r = await stepAddress(index, res, isStandard)
            if (r.account) next(r.account)
            if (r.complete) {
              break
            }
          }
        }
        complete()
      } catch (e) {
        error(e)
      }
    }

    main()

    return { unsubscribe }
  },

  synchronize({ freshAddress, blockHeight, currency, operations }, { next, complete, error }) {
    let unsubscribed = false
    const api = apiForCurrency(currency)
    async function main() {
      try {
        const block = await fetchCurrentBlock(currency)
        if (unsubscribed) return
        if (block.height === blockHeight) {
          complete()
        } else {
          operations = operations.filter(
            o => !o.blockHeight || blockHeight - o.blockHeight < SAFE_REORG_THRESHOLD,
          )
          const blockHash = operations.length > 0 ? operations[0].blockHash : undefined
          const { txs } = await api.getTransactions(freshAddress, blockHash)
          if (unsubscribed) return
          if (txs.length === 0) {
            complete()
            return
          }
          const balance = await api.getAccountBalance(freshAddress)
          if (unsubscribed) return
          const nonce = await api.getAccountNonce(freshAddress)
          if (unsubscribed) return
          next(a => {
            const currentOps = a.operations
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
          complete()
        }
      } catch (e) {
        error(e)
      }
    }
    main()

    return {
      unsubscribe() {
        unsubscribed = true
      },
    }
  },

  pullMoreOperations: () => Promise.resolve(a => a), // NOT IMPLEMENTED

  isRecipientValid: (currency, recipient) => Promise.resolve(isRecipientValid(currency, recipient)),

  createTransaction: () => ({
    amount: 0,
    recipient: '',
    gasPrice: 0,
    gasLimit: 0x5208,
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

  isValidTransaction: (a, t) => (t.amount > 0 && t.recipient && true) || false,

  // $FlowFixMe
  EditFees,

  // $FlowFixMe
  EditAdvancedOptions,

  canBeSpent: (a, t) => Promise.resolve(t.amount <= a.balance),
  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.gasPrice * t.gasLimit),
  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.gasPrice * t.gasLimit),

  signAndBroadcast: async (a, t, deviceId) => {
    const api = apiForCurrency(a.currency)

    const nonce = await api.getAccountNonce(a.freshAddress)

    const transaction = await signTransactionCommand
      .send({
        currencyId: a.currency.id,
        devicePath: deviceId,
        path: a.freshAddressPath,
        transaction: { ...t, nonce },
      })
      .toPromise()

    const hash = await api.broadcastTransaction(transaction)

    return {
      id: `${a.id}-${hash}-OUT`,
      hash,
      type: 'OUT',
      value: t.amount,
      fee: t.gasPrice * t.gasLimit,
      blockHeight: null,
      blockHash: null,
      accountId: a.id,
      senders: [a.freshAddress],
      recipients: [t.recipient],
      transactionSequenceNumber: nonce,
      date: new Date(),
    }
  },

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
