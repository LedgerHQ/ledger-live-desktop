// @flow
import React from 'react'
import EthereumKind from 'components/FeesField/EthereumKind'
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

type Transaction = *

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <EthereumKind
    onChange={gasPrice => {
      onChange({ ...value, gasPrice })
    }}
    gasPrice={value.gasPrice}
    account={account}
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
  if (sending) {
    ops.push({
      id: `${account.id}-${tx.hash}-OUT`,
      hash: tx.hash,
      type: 'OUT',
      value: tx.value + tx.gas_price * tx.gas_used,
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
      blockHeight: tx.block && tx.block.height,
      blockHash: tx.block && tx.block.hash,
      accountId: account.id,
      senders: [tx.from],
      recipients: [tx.to],
      date: new Date(tx.received_at),
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
  return uniqBy(all.sort((a, b) => a.date - b.date), 'id')
}

const paginateMoreTransactions = async (
  account: Account,
  acc: Operation[],
): Promise<Operation[]> => {
  const api = apiForCurrency(account.currency)
  const { txs } = await api.getTransactions(
    account.freshAddress,
    acc.length ? acc[acc.length - 1].blockHash : undefined,
  )
  if (txs.length === 0) return acc
  return mergeOps(acc, flatMap(txs, txToOps(account)))
}

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
      const { txs } = await api.getTransactions(address)
      if (finished) return { complete: true }

      const path = freshAddressPath // FIXME
      const freshAddress = address

      if (txs.length === 0) {
        // this is an empty account
        if (isStandard) {
          if (newAccountCount === 0) {
            // first zero account will emit one account as opportunity to create a new account..
            const accountId = `${currency.id}_${address}`
            const account: $Exact<Account> = {
              id: accountId,
              xpub: '',
              path, // FIXME we probably not want the address path in the account.path
              freshAddress,
              freshAddressPath,
              name: 'New Account',
              balance,
              blockHeight: currentBlock.height,
              archived: true,
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

      const accountId = `${currency.id}_${address}`
      const account: $Exact<Account> = {
        id: accountId,
        xpub: '',
        path, // FIXME we probably not want the address path in the account.path
        freshAddress,
        freshAddressPath,
        name: address.slice(32),
        balance,
        blockHeight: currentBlock.height,
        archived: true,
        index,
        currency,
        operations: [],
        pendingOperations: [],
        unit: currency.units[0],
        lastSyncDate: new Date(),
      }
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

  synchronize({ freshAddress, blockHeight, currency }, { next, complete, error }) {
    let unsubscribed = false
    const api = apiForCurrency(currency)
    async function main() {
      try {
        const block = await fetchCurrentBlock(currency)
        if (unsubscribed) return
        if (block.height === blockHeight) {
          complete()
        } else {
          const balance = await api.getAccountBalance(freshAddress)
          if (unsubscribed) return
          const { txs } = await api.getTransactions(freshAddress)
          if (unsubscribed) return
          const nonce = await api.getAccountNonce(freshAddress)
          if (unsubscribed) return
          next(a => {
            const currentOps = a.operations
            const newOps = flatMap(txs, txToOps(a))
            const { length: newLength } = newOps
            const { length } = currentOps
            if (
              // still empty
              (length === 0 && newLength === 0) ||
              // latest is still same
              (length > 0 && newLength > 0 && currentOps[0].id === newOps[0].id)
            ) {
              return a
            }
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

  pullMoreOperations: async account => {
    const operations = await paginateMoreTransactions(account, account.operations)
    return a => ({ ...a, operations })
  },

  isRecipientValid: (currency, recipient) => Promise.resolve(isRecipientValid(currency, recipient)),

  createTransaction: () => ({
    amount: 0,
    recipient: '',
    gasPrice: 0,
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

  // FIXME gasPrice calc is wrong... need to multiply with gasLimit I guess ?
  canBeSpent: (a, t) => Promise.resolve(t.amount + t.gasPrice <= a.balance),
  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.gasPrice),
  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.gasPrice),

  signAndBroadcast: async (a, t, deviceId) => {
    const api = apiForCurrency(a.currency)

    const nonce = await api.getAccountNonce(a.freshAddress)

    const transaction = await signTransactionCommand
      .send({
        currencyId: a.currency.id,
        devicePath: deviceId,
        path: a.path,
        transaction: { ...t, nonce },
      })
      .toPromise()

    const hash = await api.broadcastTransaction(transaction)

    return {
      id: `${a.id}-${hash}-OUT`,
      hash,
      type: 'OUT',
      value: t.amount,
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
