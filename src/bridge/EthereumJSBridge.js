// @flow
import React from 'react'
import EthereumKind from 'components/FeesField/EthereumKind'
import throttle from 'lodash/throttle'
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

const toAccountOperation = (account: Account) => (tx: Tx): Operation => {
  const sending = account.address.toLowerCase() === tx.from.toLowerCase()
  return {
    id: tx.hash,
    hash: tx.hash,
    address: sending ? tx.to : tx.from,
    amount: (sending ? -1 : 1) * tx.value,
    blockHeight: (tx.block && tx.block.height) || 0, // FIXME will be optional field
    blockHash: (tx.block && tx.block.hash) || '', // FIXME will be optional field
    accountId: account.id,
    senders: [tx.from],
    recipients: [tx.to],
    date: new Date(tx.received_at),
  }
}

function isRecipientValid(currency, recipient) {
  return !!recipient.match(/^0x[0-9a-fA-F]{40}$/)
}

function mergeOps(existing: Operation[], newFetched: Operation[]) {
  const ids = existing.map(o => o.id)
  const all = existing.concat(newFetched.filter(o => !ids.includes(o.id)))
  return all.sort((a, b) => a.date - b.date)
}

const paginateMoreTransactions = async (
  account: Account,
  acc: Operation[],
): Promise<Operation[]> => {
  const api = apiForCurrency(account.currency)
  const { txs } = await api.getTransactions(
    account.address,
    acc.length ? acc[acc.length - 1].blockHash : undefined,
  )
  if (txs.length === 0) return acc
  return mergeOps(acc, txs.map(toAccountOperation(account)))
}

const fetchCurrentBlock = (perCurrencyId => currency => {
  if (perCurrencyId[currency.id]) return perCurrencyId[currency.id]
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
  return f
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
      { address, path },
      isStandard,
    ): { account?: Account, complete?: boolean } {
      const balance = await api.getAccountBalance(address)
      if (finished) return { complete: true }
      const currentBlock = await fetchCurrentBlock(currency)
      if (finished) return { complete: true }
      const { txs } = await api.getTransactions(address)
      if (finished) return { complete: true }

      if (txs.length === 0) {
        // this is an empty account
        if (isStandard) {
          if (newAccountCount === 0) {
            // first zero account will emit one account as opportunity to create a new account..
            const currentBlock = await fetchCurrentBlock(currency)
            const accountId = `${currency.id}_${address}`
            const account: Account = {
              id: accountId,
              xpub: '',
              path, // FIXME we probably not want the address path in the account.path
              walletPath: String(index),
              name: 'New Account',
              isSegwit: false,
              address,
              addresses: [{ str: address, path }],
              balance,
              blockHeight: currentBlock.height,
              archived: true,
              index,
              currency,
              operations: [],
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
      const account: Account = {
        id: accountId,
        xpub: '',
        path, // FIXME we probably not want the address path in the account.path
        walletPath: String(index),
        name: address.slice(32),
        isSegwit: false,
        address,
        addresses: [{ str: address, path }],
        balance,
        blockHeight: currentBlock.height,
        archived: true,
        index,
        currency,
        operations: [],
        unit: currency.units[0],
        lastSyncDate: new Date(),
      }
      account.operations = txs.map(toAccountOperation(account))
      return { account }
    }

    async function main() {
      try {
        const derivations = getDerivations(currency)
        const last = derivations[derivations.length - 1]
        for (const derivation of derivations) {
          const isStandard = last === derivation
          for (let index = 0; index < 255; index++) {
            const path = derivation({ currency, x: index, segwit: false })
            const res = await getAddressCommand
              .send({ currencyId: currency.id, devicePath: deviceId, path })
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

  synchronize({ address, blockHeight, currency }, { next, complete, error }) {
    let unsubscribed = false
    const api = apiForCurrency(currency)
    async function main() {
      try {
        const block = await fetchCurrentBlock(currency)
        if (unsubscribed) return
        if (block.height === blockHeight) {
          complete()
        } else {
          const balance = await api.getAccountBalance(address)
          if (unsubscribed) return
          const { txs } = await api.getTransactions(address)
          if (unsubscribed) return
          next(a => {
            const currentOps = a.operations
            const newOps = txs.map(toAccountOperation(a))
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
            return {
              ...a,
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

  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.gasPrice),

  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.gasPrice),

  signAndBroadcast: async (a, t, deviceId) => {
    const api = apiForCurrency(a.currency)

    const nonce = await api.getAccountNonce(a.address)

    const transaction = await signTransactionCommand
      .send({
        currencyId: a.currency.id,
        devicePath: deviceId,
        path: a.path,
        transaction: { ...t, nonce },
      })
      .toPromise()

    const result = await api.broadcastTransaction(transaction)

    return result
  },
}

export default EthereumBridge
