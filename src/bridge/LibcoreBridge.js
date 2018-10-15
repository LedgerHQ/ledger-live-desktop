// @flow
import React from 'react'
import { BigNumber } from 'bignumber.js'
import { map } from 'rxjs/operators'
import LRU from 'lru-cache'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { decodeAccount, encodeAccount } from 'reducers/accounts'
import FeesBitcoinKind from 'components/FeesField/BitcoinKind'
import FeesEthereumKind from 'components/FeesField/EthereumKind'
// import AdvancedOptionsBitcoinKind from 'components/AdvancedOptions/BitcoinKind'
import AdvancedOptionsEthereumKind from 'components/AdvancedOptions/EthereumKind'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreGetFees, { extractGetFeesInputFromAccount } from 'commands/libcoreGetFees'
import libcoreValidAddress from 'commands/libcoreValidAddress'
import { NotEnoughBalance, FeeNotLoaded } from 'config/errors'
import type { WalletBridge, EditProps } from './types'

const NOT_ENOUGH_FUNDS = 52

const notImplemented = new Error('LibcoreBridge: not implemented')

type Transaction = {
  amount: BigNumber,
  feePerByte: ?BigNumber,
  recipient: string,
}

const serializeTransaction = (t, a) => {
  if (a.currency.family === 'ethereum') {
    return {
      recipient: t.recipient,
      amount: `0x${BigNumber(t.amount).toString(16)}`,
      gasPrice: !t.gasPrice ? '0x00' : `0x${BigNumber(t.gasPrice).toString(16)}`,
      gasLimit: `0x${BigNumber(t.gasLimit).toString(16)}`,
    }
  }
  const { feePerByte } = t
  return {
    recipient: t.recipient,
    amount: t.amount.toString(),
    feePerByte: (feePerByte && feePerByte.toString()) || '0',
  }
}

const decodeOperation = (encodedAccount, rawOp) =>
  decodeAccount({ ...encodedAccount, operations: [rawOp] }).operations[0]

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => {
  if (account.currency.family === 'ethereum') {
    return (
      <FeesEthereumKind
        onChange={gasPrice => {
          onChange({ ...value, gasPrice })
        }}
        gasPrice={value.gasPrice}
        account={account}
      />
    )
  }
  return (
    <FeesBitcoinKind
      onChange={feePerByte => {
        onChange({ ...value, feePerByte })
      }}
      feePerByte={value.feePerByte}
      account={account}
    />
  )
}

const EditAdvancedOptions = ({ account, onChange, value }: EditProps<Transaction>) => {
  if (account.currency.family === 'ethereum') {
    console.log(value)
    return (
      <AdvancedOptionsEthereumKind
        gasLimit={value.gasLimit}
        onChangeGasLimit={gasLimit => {
          onChange({ ...value, gasLimit })
        }}
      />
    )
  }
  return null
  // return (
  //   <AdvancedOptionsBitcoinKind
  //     isRBF={value.isRBF}
  //     onChangeRBF={isRBF => {
  //       onChange({ ...value, isRBF })
  //     }}
  //   />
  // )
}

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
  `${a.id}_${a.blockHeight || 0}_${t.amount.toString()}_${t.recipient}_${
    t.feePerByte ? t.feePerByte.toString() : ''
  }`

const getFees = async (a, transaction) => {
  const isValid = await isRecipientValid(a.currency, transaction.recipient)
  if (!isValid) return null
  const key = getFeesKey(a, transaction)
  let promise = feesLRU.get(key)
  if (promise) return promise

  promise = libcoreGetFees
    .send({
      ...extractGetFeesInputFromAccount(a),
      transaction: serializeTransaction(transaction, a),
    })
    .toPromise()
    .then(r => BigNumber(r.totalFees))
  feesLRU.set(key, promise)
  return promise
}

const checkValidTransaction = (a, t) =>
  a.currency.family === 'bitcoin' && !t.feePerByte
    ? Promise.reject(new FeeNotLoaded())
    : !t.amount
      ? Promise.resolve(true)
      : getFees(a, t)
          .then(totalFees => {
            const totalSpent = t.amount.plus(totalFees || 0)
            if (totalSpent.isGreaterThan(a.balance)) {
              throw new NotEnoughBalance()
            }
            return true
          })
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
    libcoreSyncAccount
      .send({
        accountId: account.id,
        derivationMode: account.derivationMode,
        xpub: account.xpub || '',
        seedIdentifier: account.seedIdentifier,
        index: account.index,
        currencyId: account.currency.id,
      })
      .pipe(
        map(({ rawAccount, requiresCacheFlush }) => {
          const syncedAccount = decodeAccount(rawAccount)
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

  isRecipientValid,
  getRecipientWarning: () => Promise.resolve(null),

  createTransaction: account => {
    if (account.currency.family === 'ethereum') {
      return {
        amount: BigNumber(0),
        recipient: '',
        gasPrice: null,
        gasLimit: BigNumber(0x5208),
      }
    }
    return {
      amount: BigNumber(0),
      recipient: '',
      feePerByte: null,
      isRBF: false,
    }
  },

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
        accountId: account.id,
        currencyId: account.currency.id,
        blockHeight: account.blockHeight,
        xpub: account.xpub || '', // FIXME only reason is to build the op id. we need to consider another id for making op id.
        derivationMode: account.derivationMode,
        seedIdentifier: account.seedIdentifier,
        index: account.index,
        transaction: serializeTransaction(transaction, account),
        deviceId,
      })
      .pipe(
        map(e => {
          switch (e.type) {
            case 'broadcasted':
              return {
                type: 'broadcasted',
                operation: decodeOperation(encodeAccount(account), e.operation),
              }
            default:
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
