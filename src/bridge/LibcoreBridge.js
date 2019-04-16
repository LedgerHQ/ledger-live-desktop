// @flow
import React from 'react'
import { BigNumber } from 'bignumber.js'
import { map } from 'rxjs/operators'
import LRU from 'lru-cache'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { deserializeError } from '@ledgerhq/errors/lib/helpers'
import { fromOperationRaw, toAccountRaw, fromAccountRaw } from '@ledgerhq/live-common/lib/account'
import FeesBitcoinKind from 'components/FeesField/BitcoinKind'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreGetFees from 'commands/libcoreGetFees'
import libcoreValidAddress from 'commands/libcoreValidAddress'
import { NotEnoughBalance, FeeNotLoaded } from '@ledgerhq/errors'
import type { WalletBridge, EditProps } from './types'

const notImplemented = new Error('LibcoreBridge: not implemented')

type Transaction = {
  amount: BigNumber,
  feePerByte: ?BigNumber,
  recipient: string,
}

const serializeTransaction = t => {
  const { feePerByte } = t
  return {
    recipient: t.recipient,
    amount: t.amount.toString(),
    feePerByte: (feePerByte && feePerByte.toString()) || '0',
  }
}

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChange={feePerByte => {
      onChange({ ...value, feePerByte })
    }}
    feePerByte={value.feePerByte}
    account={account}
  />
)

const recipientValidLRU = LRU({ max: 100 })

const isRecipientValid = (account, recipient): Promise<?Error> => {
  const key = `${account.currency.id}_${recipient}`
  let promise = recipientValidLRU.get(key)
  if (promise) return promise
  if (!recipient) return Promise.resolve(null)
  promise = libcoreValidAddress
    .send({
      address: recipient,
      currencyId: account.currency.id,
    })
    .toPromise()
    .then(o => o && deserializeError(o))
  recipientValidLRU.set(key, promise)
  return promise
}

const feesLRU = LRU({ max: 100 })

const getFeesKey = (a, t) =>
  `${a.id}_${a.blockHeight || 0}_${t.amount.toString()}_${t.recipient}_${
    t.feePerByte ? t.feePerByte.toString() : ''
  }`

const getFees = async (a, transaction) => {
  await isRecipientValid(a, transaction.recipient)
  const key = getFeesKey(a, transaction)
  let promise = feesLRU.get(key)
  if (promise) return promise

  promise = libcoreGetFees
    .send({
      accountRaw: toAccountRaw({ ...a, transactions: [] }),
      transaction: serializeTransaction(transaction),
    })
    .toPromise()
    .then(r => BigNumber(r.totalFees))
  feesLRU.set(key, promise)
  return promise
}

const checkValidTransaction = (a, t) =>
  !t.feePerByte
    ? Promise.reject(new FeeNotLoaded())
    : t.feePerByte.eq(0)
      ? Promise.resolve(false)
      : !t.amount
        ? Promise.resolve(true)
        : getFees(a, t)
            .then(() => true)
            .catch(e => {
              if (e instanceof NotEnoughBalance) {
                throw e
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
      .pipe(map(fromAccountRaw))
  },

  synchronize: account =>
    libcoreSyncAccount
      .send({
        rawAccount: toAccountRaw(account),
      })
      .pipe(
        map(({ rawAccount, requiresCacheFlush }) => {
          const syncedAccount = fromAccountRaw(rawAccount)
          return account => {
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
              requiresCacheFlush ||
              accountOps.length !== syncedOps.length || // size change, we do a full refresh for now...
              (accountOps.length > 0 &&
                syncedOps.length > 0 &&
                (accountOps[0].id !== syncedOps[0].id || // if same size, only check if the last item has changed.
                  accountOps[0].blockHeight !== syncedOps[0].blockHeight))

            if (hasChanged) {
              patch.operations = syncedAccount.operations
              patch.pendingOperations = [] // For now, we assume a change will clean the pendings.
            }

            return {
              ...account,
              ...patch,
            }
          }
        }),
      ),

  pullMoreOperations: () => Promise.reject(notImplemented),

  // TODO we need to move to the new bridge interface that unify these two:
  isRecipientValid: (...args) => isRecipientValid(...args).then(() => true, () => false),
  getRecipientWarning: (...args) => isRecipientValid(...args).catch(() => null),

  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: '',
    feePerByte: null,
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

  checkValidTransaction,

  getTotalSpent: (a, t) =>
    t.amount.isZero()
      ? Promise.resolve(BigNumber(0))
      : getFees(a, t)
          .then(totalFees => t.amount.plus(totalFees || 0))
          .catch(() => BigNumber(0)),

  getMaxAmount: (a, t) =>
    getFees(a, t)
      .catch(() => BigNumber(0))
      .then(totalFees => a.balance.minus(totalFees || 0)),

  signAndBroadcast: (account, transaction, deviceId) =>
    libcoreSignAndBroadcast
      .send({
        account: toAccountRaw({ ...account, operations: [] }),
        transaction: serializeTransaction(transaction),
        deviceId,
      })
      .pipe(
        map(e => {
          switch (e.type) {
            case 'broadcasted':
              return {
                type: 'broadcasted',
                operation: fromOperationRaw(e.operation, account.id),
              }
            default:
              // $FlowFixMe
              return e
          }
        }),
      ),

  addPendingOperation: (account, operation) => ({
    ...account,
    pendingOperations: [operation].concat(account.pendingOperations),
  }),
}

export default LibcoreBridge
