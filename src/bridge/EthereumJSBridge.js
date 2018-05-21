// @flow
import React from 'react'
import { ipcRenderer } from 'electron'
import { sendEvent } from 'renderer/events'
import EthereumKind from 'components/FeesField/EthereumKind'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import { apiForCurrency } from 'api/Ethereum'
import type { Tx } from 'api/Ethereum'
import { makeBip44Path } from 'helpers/bip32path'
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
    blockHeight: tx.block.height,
    blockHash: tx.block.hash,
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

function signTransactionOnDevice(
  a: Account,
  t: Transaction,
  deviceId: string,
  nonce: string,
): Promise<string> {
  const transaction = { ...t, nonce }
  return new Promise((resolve, reject) => {
    const unbind = () => {
      ipcRenderer.removeListener('msg', handleMsgEvent)
    }

    function handleMsgEvent(e, { data, type }) {
      if (type === 'devices.signTransaction.success') {
        unbind()
        resolve(data)
      } else if (type === 'devices.signTransaction.fail') {
        unbind()
        reject(new Error('failed to get address'))
      }
    }

    ipcRenderer.on('msg', handleMsgEvent)

    sendEvent('devices', 'signTransaction', {
      currencyId: a.currency.id,
      devicePath: deviceId,
      path: a.path,
      transaction,
    })
  })
}

const EthereumBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
    let finished = false
    const unbind = () => {
      finished = true
      ipcRenderer.removeListener('msg', handleMsgEvent)
    }
    const api = apiForCurrency(currency)

    // FIXME: THIS IS SPAghetti, we need to move to a more robust approach to get an observable with a sendEvent
    // in future ideally what we want is:
    // return mergeMap(addressesObservable, address => fetchAccount(address))

    let index = 0
    let balanceZerosCount = 0

    function pollNextAddress() {
      sendEvent('devices', 'getAddress', {
        currencyId: currency.id,
        devicePath: deviceId,
        path: makeBip44Path({
          currency,
          x: index,
        }),
      })
      index++
    }

    let currentBlockPromise
    function lazyCurrentBlock() {
      if (!currentBlockPromise) {
        currentBlockPromise = api.getCurrentBlock()
      }
      return currentBlockPromise
    }

    async function stepAddress({ address, path }) {
      try {
        const balance = await api.getAccountBalance(address)
        if (finished) return
        if (balance === 0) {
          if (balanceZerosCount === 0) {
            // first zero account will emit one account as opportunity to create a new account..
            const currentBlock = await lazyCurrentBlock()
            const accountId = `${currency.id}_${address}`
            const account: Account = {
              id: accountId,
              xpub: '',
              path,
              walletPath: String(index),
              name: 'New Account',
              isSegwit: false,
              address,
              addresses: [address],
              balance,
              blockHeight: currentBlock.height,
              archived: true,
              index,
              currency,
              operations: [],
              unit: currency.units[0],
              lastSyncDate: new Date(),
            }
            next(account)
          }
          balanceZerosCount++
          // NB we currently stop earlier. in future we shouldn't stop here, just continue & user will stop at the end!
          // NB (what's the max tho?)
          unbind()
          complete()
        } else {
          const currentBlock = await lazyCurrentBlock()
          if (finished) return
          const { txs } = await api.getTransactions(address)
          if (finished) return
          const accountId = `${currency.id}_${address}`
          const account: Account = {
            id: accountId,
            xpub: '',
            path,
            walletPath: String(index),
            name: address.slice(32),
            isSegwit: false,
            address,
            addresses: [address],
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
          next(account)
          pollNextAddress()
        }
      } catch (e) {
        error(e)
      }
    }

    function handleMsgEvent(e, { data, type }) {
      if (type === 'devices.getAddress.success') {
        stepAddress(data)
      } else if (type === 'devices.getAddress.fail') {
        error(new Error(data.message))
      }
    }

    ipcRenderer.on('msg', handleMsgEvent)

    pollNextAddress()

    return {
      unsubscribe() {
        unbind()
      },
    }
  },

  synchronize({ address, blockHeight, currency }, { next, complete, error }) {
    let unsubscribed = false
    const api = apiForCurrency(currency)
    async function main() {
      try {
        const block = await api.getCurrentBlock()
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
            if (newOps.length === 0 && currentOps.length === 0) return a
            if (currentOps[0].id === newOps[0].id) return a
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
    const transaction = await signTransactionOnDevice(a, t, deviceId, nonce)
    const result = await api.broadcastTransaction(transaction)
    return result
  },
}

export default EthereumBridge
