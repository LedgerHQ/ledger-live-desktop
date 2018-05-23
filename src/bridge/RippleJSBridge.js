// @flow
import React from 'react'
import bs58check from 'ripple-bs58check'
import { computeBinaryTransactionHash } from 'ripple-hashes'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import { getDerivations } from 'helpers/derivations'
import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'
import {
  apiForCurrency,
  parseAPIValue,
  parseAPICurrencyObject,
  formatAPICurrencyXRP,
} from 'api/Ripple'
import FeesRippleKind from 'components/FeesField/RippleKind'
import AdvancedOptionsRippleKind from 'components/AdvancedOptions/RippleKind'
import type { WalletBridge, EditProps } from './types'

type Transaction = {
  amount: number,
  recipient: string,
  fee: number,
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
  return all.sort((a, b) => a.date - b.date)
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
  outcome: { deliveredAmount, ledgerVersion, timestamp },
  specification: { source, destination },
}: Tx): Operation => {
  const sending = source.address === account.address
  const amount =
    (sending ? -1 : 1) * (deliveredAmount ? parseAPICurrencyObject(deliveredAmount) : 0)
  const op: Operation = {
    id,
    hash: id,
    accountId: account.id,
    blockHash: '',
    address: sending ? destination.address : source.address,
    amount,
    blockHeight: ledgerVersion,
    senders: [sending ? destination.address : source.address],
    recipients: [!sending ? destination.address : source.address],
    date: new Date(timestamp),
  }
  return op
}

const RippleJSBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice(currency, deviceId, { next, complete, error }) {
    let finished = false
    const unsubscribe = () => {
      finished = true
    }

    async function main() {
      const api = apiForCurrency(currency)
      try {
        await api.connect()
        const serverInfo = await api.getServerInfo()
        const ledgers = serverInfo.completeLedgers.split('-')
        const minLedgerVersion = Number(ledgers[0])
        const maxLedgerVersion = Number(ledgers[1])

        const derivations = getDerivations(currency)
        for (const derivation of derivations) {
          for (let index = 0; index < 255; index++) {
            const path = derivation({ currency, x: index, segwit: false })
            const { address } = await await getAddress
              .send({ currencyId: currency.id, devicePath: deviceId, path })
              .toPromise()
            if (finished) return

            const accountId = `${currency.id}_${address}`

            let info
            try {
              info = await api.getAccountInfo(address)
            } catch (e) {
              if (e.message !== 'actNotFound') {
                throw e
              }
            }

            if (!info) {
              // account does not exist in Ripple server
              // we are generating a new account locally
              next({
                id: accountId,
                xpub: '',
                path,
                walletPath: '',
                name: 'New Account',
                isSegwit: false,
                address,
                addresses: [address],
                balance: 0,
                blockHeight: maxLedgerVersion,
                index,
                currency,
                operations: [],
                unit: currency.units[0],
                archived: true,
                lastSyncDate: new Date(),
              })
              break
            }

            if (finished) return
            const balance = parseAPIValue(info.xrpBalance)
            if (isNaN(balance) || !isFinite(balance)) {
              throw new Error(`Ripple: invalid balance=${balance} for address ${address}`)
            }

            const transactions = await api.getTransactions(address, {
              minLedgerVersion,
              maxLedgerVersion,
            })
            if (finished) return

            const account: Account = {
              id: accountId,
              xpub: '',
              path,
              walletPath: '',
              name: address.slice(0, 8),
              isSegwit: false,
              address,
              addresses: [address],
              balance,
              blockHeight: maxLedgerVersion,
              index,
              currency,
              operations: [],
              unit: currency.units[0],
              archived: true,
              lastSyncDate: new Date(),
            }
            account.operations = transactions.map(txToOperation(account))
            next(account)
          }
        }
        complete()
      } catch (e) {
        error(e)
      } finally {
        api.disconnect()
      }
    }

    main()

    return { unsubscribe }
  },

  synchronize({ currency, address, blockHeight }, { next, error, complete }) {
    let finished = false
    const unsubscribe = () => {
      finished = true
    }

    async function main() {
      const api = apiForCurrency(currency)
      try {
        await api.connect()
        if (finished) return
        const serverInfo = await api.getServerInfo()
        if (finished) return
        const ledgers = serverInfo.completeLedgers.split('-')
        const minLedgerVersion = Number(ledgers[0])
        const maxLedgerVersion = Number(ledgers[1])

        let info
        try {
          info = await api.getAccountInfo(address)
        } catch (e) {
          if (e.message !== 'actNotFound') {
            throw e
          }
        }
        if (finished) return

        if (!info) {
          // account does not exist, we have nothing to sync
          complete()
          return
        }

        const balance = parseAPIValue(info.xrpBalance)
        if (isNaN(balance) || !isFinite(balance)) {
          throw new Error(`Ripple: invalid balance=${balance} for address ${address}`)
        }

        next(a => ({ ...a, balance }))

        const transactions = await api.getTransactions(address, {
          minLedgerVersion: Math.max(blockHeight, minLedgerVersion),
          maxLedgerVersion,
        })

        if (finished) return

        next(a => {
          const newOps = transactions.map(txToOperation(a))
          const operations = mergeOps(a.operations, newOps)
          return {
            ...a,
            operations,
            blockHeight: maxLedgerVersion,
            lastSyncDate: new Date(),
          }
        })

        complete()
      } catch (e) {
        error(e)
      } finally {
        api.disconnect()
      }
    }

    main()

    return { unsubscribe }
  },

  pullMoreOperations: () => Promise.resolve(a => a), // FIXME not implemented

  isRecipientValid: (currency, recipient) => Promise.resolve(isRecipientValid(currency, recipient)),

  createTransaction: () => ({
    amount: 0,
    recipient: '',
    fee: 0,
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

  // $FlowFixMe
  EditFees,

  // $FlowFixMe
  EditAdvancedOptions,

  getTransactionRecipient: (a, t) => t.recipient,

  isValidTransaction: (a, t) => (t.amount > 0 && t.recipient && true) || false,

  getTotalSpent: (a, t) => Promise.resolve(t.amount + t.fee),

  getMaxAmount: (a, t) => Promise.resolve(a.balance - t.fee),

  signAndBroadcast: async (a, t, deviceId) => {
    const api = apiForCurrency(a.currency)
    try {
      await api.connect()
      const amount = formatAPICurrencyXRP(t.amount)
      const payment = {
        source: {
          address: a.address,
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
      }

      const prepared = await api.preparePayment(a.address, payment, instruction)

      const transaction = await signTransaction
        .send({
          currencyId: a.currency.id,
          devicePath: deviceId,
          path: a.path,
          transaction: JSON.parse(prepared.txJSON),
        })
        .toPromise()

      const submittedPayment = await api.submit(transaction)

      if (submittedPayment.resultCode !== 'tesSUCCESS') {
        throw new Error(submittedPayment.resultMessage)
      }

      return computeBinaryTransactionHash(transaction)
    } finally {
      api.disconnect()
    }
  },
}

export default RippleJSBridge
