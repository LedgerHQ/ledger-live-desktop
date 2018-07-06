// @flow
import React from 'react'
import { Observable } from 'rxjs'
import LRU from 'lru-cache'
import { map } from 'rxjs/operators'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { decodeAccount, encodeAccount } from 'reducers/accounts'
import FeesBitcoinKind from 'components/FeesField/BitcoinKind'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreGetFees from 'commands/libcoreGetFees'
import libcoreValidAddress from 'commands/libcoreValidAddress'
import { createCustomErrorClass } from 'helpers/errors'
import type { WalletBridge, EditProps } from './types'

const NOT_ENOUGH_FUNDS = 52
const NotEnoughBalance = createCustomErrorClass('NotEnoughBalance')

const notImplemented = new Error('LibcoreBridge: not implemented')

type Transaction = {
  amount: number,
  feePerByte: number,
  recipient: string,
}

const decodeOperation = (encodedAccount, rawOp) =>
  decodeAccount({ ...encodedAccount, operations: [rawOp] }).operations[0]

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChange={feePerByte => {
      onChange({ ...value, feePerByte })
    }}
    feePerByte={value.feePerByte}
    account={account}
  />
)

/*
import AdvancedOptionsBitcoinKind from 'components/AdvancedOptions/BitcoinKind'
const EditAdvancedOptions = ({ onChange, value }: EditProps<Transaction>) => (
  <AdvancedOptionsBitcoinKind
    isRBF={value.isRBF}
    onChangeRBF={isRBF => {
      onChange({ ...value, isRBF })
    }}
  />
)
*/

const recipientValidLRU = LRU({ max: 100 })

const isRecipientValid = (currency, recipient) => {
  const key = `${currency.id}_${recipient}`
  let promise = recipientValidLRU.get(key)
  if (promise) return promise
  if (!recipient) return Promise.resolve(false)
  promise = libcoreValidAddress
    .send({
      address: recipient,
      currencyId: currency.id,
    })
    .toPromise()
  recipientValidLRU.set(key, promise)
  return promise
}

const feesLRU = LRU({ max: 100 })

const getFeesKey = (a, t) =>
  `${a.id}_${a.blockHeight || 0}_${t.amount}_${t.recipient}_${t.feePerByte}`

const getFees = async (a, transaction) => {
  const isValid = await isRecipientValid(a.currency, transaction.recipient)
  if (!isValid) return null
  const key = getFeesKey(a, transaction)
  let promise = feesLRU.get(key)
  if (promise) return promise
  promise = libcoreGetFees
    .send({ accountId: a.id, accountIndex: a.index, transaction })
    .toPromise()
    .then(r => r.totalFees)
  feesLRU.set(key, promise)
  return promise
}

const checkCanBeSpent = (a, t) =>
  !t.amount
    ? Promise.resolve()
    : getFees(a, t)
        .then(() => {})
        .catch(e => {
          if (e.code === NOT_ENOUGH_FUNDS) {
            throw new NotEnoughBalance()
          }
          feesLRU.del(getFeesKey(a, t))
          throw e
        })

const LibcoreBridge: WalletBridge<Transaction> = {
  scanAccountsOnDevice(currency, devicePath) {
    return libcoreScanAccounts
      .send({
        devicePath,
        currencyId: currency.id,
      })
      .pipe(map(decodeAccount))
  },

  synchronize: account =>
    Observable.create(o => {
      // FIXME TODO:
      // - when you implement addPendingOperation you also here need to:
      //   - if there were pendingOperations that are now in operations, remove them as well.
      //   - if there are pendingOperations that is older than a threshold (that depends on blockchain speed typically)
      //     then we probably should trash them out? it's a complex question for UI
      ;(async () => {
        try {
          const rawAccount = encodeAccount(account)
          const rawSyncedAccount = await libcoreSyncAccount.send({ rawAccount }).toPromise()
          const syncedAccount = decodeAccount(rawSyncedAccount)
          o.next(account => {
            const accountOps = account.operations
            const syncedOps = syncedAccount.operations
            const patch: $Shape<Account> = {
              id: syncedAccount.id,
              freshAddress: syncedAccount.freshAddress,
              freshAddressPath: syncedAccount.freshAddressPath,
              balance: syncedAccount.balance,
              blockHeight: syncedAccount.blockHeight,
              lastSyncDate: new Date(),
            }

            const hasChanged =
              accountOps.length !== syncedOps.length || // size change, we do a full refresh for now...
              (accountOps.length > 0 &&
                syncedOps.length > 0 &&
                (accountOps[0].accountId !== syncedOps[0].accountId ||
                  accountOps[0].id !== syncedOps[0].id)) // if same size, only check if the last item has changed.

            if (hasChanged) {
              patch.operations = syncedAccount.operations
              patch.pendingOperations = [] // For now, we assume a change will clean the pendings.
            }

            return {
              ...account,
              ...patch,
            }
          })
          o.complete()
        } catch (e) {
          o.error(e)
        }
      })()
      return {
        unsubscribe() {
          // LibcoreBridge: unsub sync not currently implemented
        },
      }
    }),

  pullMoreOperations: () => Promise.reject(notImplemented),

  isRecipientValid,

  createTransaction: () => ({
    amount: 0,
    recipient: '',
    feePerByte: 0,
    isRBF: false,
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

  // EditAdvancedOptions,

  isValidTransaction: (a, t) => (t.amount > 0 && t.recipient && true) || false,

  checkCanBeSpent,

  getTotalSpent: (a, t) =>
    !t.amount
      ? Promise.resolve(0)
      : getFees(a, t)
          .then(totalFees => t.amount + (totalFees || 0))
          .catch(() => 0),

  getMaxAmount: (a, t) =>
    getFees(a, t)
      .catch(() => 0)
      .then(totalFees => a.balance - (totalFees || 0)),

  signAndBroadcast: (account, transaction, deviceId) => {
    const encodedAccount = encodeAccount(account) // FIXME no need to send the whole account over the threads
    return libcoreSignAndBroadcast
      .send({
        account: encodedAccount,
        transaction,
        deviceId,
      })
      .pipe(
        map(e => {
          switch (e.type) {
            case 'broadcasted':
              return {
                type: 'broadcasted',
                operation: decodeOperation(encodedAccount, e.operation),
              }
            default:
              return e
          }
        }),
      )
  },

  addPendingOperation: (account, operation) => ({
    ...account,
    pendingOperations: [operation].concat(account.pendingOperations),
  }),
}

export default LibcoreBridge
