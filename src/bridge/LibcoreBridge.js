// @flow
import invariant from 'invariant'
import { BigNumber } from 'bignumber.js'
import { map } from 'rxjs/operators'
import { patchAccount } from '@ledgerhq/live-common/lib/reconciliation'
import type { Account, TokenAccount, Transaction } from '@ledgerhq/live-common/lib/types'
import type { CurrencyBridge, AccountBridge } from '@ledgerhq/live-common/lib/bridge/types'
import { FeeNotLoaded, InvalidAddress, NotEnoughBalance } from '@ledgerhq/errors'
import { makeLRUCache } from '@ledgerhq/live-common/lib/cache'
import { fromOperationRaw, toAccountRaw, fromAccountRaw } from '@ledgerhq/live-common/lib/account'
import { apiForCurrency } from '@ledgerhq/live-common/lib/api/Ethereum'
import libcoreScanAccounts from 'commands/libcoreScanAccounts'
import libcoreSyncAccount from 'commands/libcoreSyncAccount'
import libcoreSignAndBroadcast from 'commands/libcoreSignAndBroadcast'
import libcoreGetFees from 'commands/libcoreGetFees'
import libcoreValidAddress from 'commands/libcoreValidAddress'

export const currencyBridge: CurrencyBridge = {
  scanAccountsOnDevice(currency, devicePath) {
    return libcoreScanAccounts
      .send({
        devicePath,
        currencyId: currency.id,
      })
      .pipe(map(fromAccountRaw))
  },
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TODO: code below is not yet split per family but is a merge of all coin families.
// how to make this scale? need to use live-common

const getTransactionAccount = (a, t): Account | TokenAccount => {
  const { tokenAccountId } = t
  return tokenAccountId ? (a.tokenAccounts || []).find(ta => ta.id === tokenAccountId) || a : a
}

const asLibcoreTransaction = t => {
  const obj: Transaction = {
    recipient: t.recipient,
    amount: t.amount ? BigNumber(t.amount).toString() : '0',
  }

  if ('useAllAmount' in t) {
    obj.useAllAmount = t.useAllAmount
  }

  if (t.tokenAccountId) {
    obj.tokenAccountId = t.tokenAccountId
  }

  // bitcoin fields
  if (t.feePerByte) {
    obj.feePerByte = BigNumber(t.feePerByte).toString()
  }

  // ethereum fields
  if (t.gasPrice) {
    obj.gasPrice = BigNumber(t.gasPrice).toString()
  }
  if (t.gasLimit) {
    obj.gasLimit = BigNumber(t.gasLimit).toString()
  }

  // xrp
  if (t.tag) {
    obj.tag = t.tag
  }
  if (t.fee) {
    obj.fee = BigNumber(t.fee).toString()
  }
  return obj
}

const createTransaction = () => ({
  recipient: '',
  amount: undefined,
  useAllAmount: false,
  feePerByte: undefined,
  gasPrice: undefined,
  gasLimit: undefined,
  tag: undefined,
  fee: undefined,
  tokenAccountId: undefined,
})

const feesLoaded = (a, t) => {
  switch (a.currency.family) {
    case 'bitcoin':
      return !!t.feePerByte
    case 'ethereum':
      return !!t.gasPrice
    case 'ripple':
      return !!t.fee
    default:
      return false
  }
}
const feesHashFunction = (a, t) =>
  `${a.id}_${a.blockHeight || 0}_${(t.amount || '0').toString()}_${t.recipient}_${
    t.feePerByte ? t.feePerByte.toString() : ''
  }_${t.useAllAmount ? 'sendMax' : 'noSendMax'}_${t.gasLimit ? t.gasLimit.toString() : ''}_${
    t.gasPrice ? t.gasPrice.toString() : ''
  }_${t.fee ? t.fee.toString() : ''}`
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const startSync = (initialAccount, _observation) =>
  libcoreSyncAccount
    .send(toAccountRaw(initialAccount))
    .pipe(map(raw => account => patchAccount(account, raw)))

const checkValidRecipient = makeLRUCache(
  (account, recipient) => {
    if (!recipient)
      return Promise.reject(new InvalidAddress('', { currencyName: account.currency.name }))
    return libcoreValidAddress
      .send({
        address: recipient,
        currencyId: account.currency.id,
      })
      .toPromise()
  },
  (currency, recipient) => `${currency.id}_${recipient}`,
)

/*
const fetchTransactionNetworkInfo = async ({ currency }) => {
  const feeItems = await getFeeItems(currency)
  return { feeItems }
}
const getTransactionNetworkInfo = (account, transaction) => transaction.networkInfo

const applyTransactionNetworkInfo = (account, transaction, networkInfo) => ({
  ...transaction,
  networkInfo,
  feePerByte: transaction.feePerByte || networkInfo.feeItems.defaultFeePerByte,
})
*/

// TODO do we need this concept to live here? probably will have to be moved to live-common because is crypto dependent.
const fetchTransactionNetworkInfo = () => Promise.resolve({})
const getTransactionNetworkInfo = () => ({})
const applyTransactionNetworkInfo = (_account, transaction) => transaction

const editTransactionAmount = (account, t, amount) => ({
  ...t,
  amount,
})

const getTransactionAmount = (a, t) => BigNumber(t.amount || '0')

const editTransactionRecipient = (account, t, recipient) => ({
  ...t,
  recipient,
  gasLimit: undefined, // need recalculation
})

const getTransactionRecipient = (a, t) => t.recipient

const editTransactionExtra = (a, t, field, value) => {
  switch (field) {
    case 'feePerByte':
      invariant(
        !value || BigNumber.isBigNumber(value),
        "editTransactionExtra(a,t,'feePerByte',value): BigNumber value expected",
      )
      return { ...t, feePerByte: value }

    case 'useAllAmount':
      invariant(
        typeof value === 'boolean',
        "editTransactionExtra(a,t,'useAllAmount',value): boolean value expected",
      )
      return { ...t, useAllAmount: value }

    case 'gasLimit':
      invariant(
        value && BigNumber.isBigNumber(value),
        "editTransactionExtra(a,t,'gasLimit',value): BigNumber value expected",
      )
      return { ...t, gasLimit: value }

    case 'gasPrice':
      invariant(
        !value || BigNumber.isBigNumber(value),
        "editTransactionExtra(a,t,'gasPrice',value): BigNumber value expected",
      )
      return { ...t, gasPrice: value }

    case 'fee':
      invariant(
        !value || BigNumber.isBigNumber(value),
        "editTransactionExtra(a,t,'fee',value): BigNumber value expected",
      )
      return { ...t, fee: value }

    case 'tag':
      invariant(
        !value || typeof value === 'number',
        "editTransactionExtra(a,t,'tag',value): number value expected",
      )
      return { ...t, tag: value }

    default:
      return t
  }
}

const getTransactionExtra = (a, t, field) => t[field] // could add more check in future

const editTokenAccountId = (a, t, tokenAccountId) => ({
  ...t,
  tokenAccountId,
  gasLimit: undefined, // need recalculation
})

const getTokenAccountId = (a, t) => t.tokenAccountId

const signAndBroadcast = (account, transaction, deviceId) =>
  libcoreSignAndBroadcast
    .send({
      account: toAccountRaw({ ...account, operations: [] }),
      transaction: asLibcoreTransaction(transaction),
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
            return e
        }
      }),
    )

const getFees = makeLRUCache(async (a, t) => {
  await checkValidRecipient(a, t.recipient)
  const fees = await libcoreGetFees
    .send({
      accountRaw: toAccountRaw({ ...a, transactions: [] }),
      transaction: asLibcoreTransaction(t),
    })
    .toPromise()

  if (
    // FIXME workaround for LLC-246
    a.currency.family === 'ethereum' &&
    !t.tokenAccountId &&
    !t.useAllAmount &&
    t.amount &&
    BigNumber(t.amount)
      .plus(fees)
      .isGreaterThan(a.balance)
  ) {
    throw new NotEnoughBalance()
  }

  return fees
}, feesHashFunction)

const checkValidTransaction = async (a, t) =>
  !feesLoaded(a, t)
    ? Promise.reject(new FeeNotLoaded())
    : !t.amount
    ? Promise.resolve(null)
    : getFees(a, t).then(() => null)

const getTotalSpent = async (a, t) => {
  const tAccount = getTransactionAccount(a, t)

  if (t.useAllAmount) {
    return tAccount.balance
  }

  const amount = BigNumber(t.amount || '0')
  if (amount.isZero()) {
    return Promise.resolve(amount)
  }

  if (tAccount.type === 'TokenAccount') {
    return Promise.resolve(amount)
  }

  return getFees(a, t).then(totalFees => amount.plus(totalFees || 0))
}

const getMaxAmount = async (a, t) => {
  const tAccount = getTransactionAccount(a, t)
  if (tAccount.type === 'TokenAccount') {
    return Promise.resolve(tAccount.balance)
  }
  return getFees(a, t).then(totalFees => tAccount.balance.minus(totalFees || 0))
}

const estimateGasLimitForERC20 = makeLRUCache(
  (currency, addr) => apiForCurrency(currency).estimateGasLimitForERC20(addr),
  (currency, addr) => `${currency.id}_${addr}`,
)

const prepareTransaction = (a, t) => {
  if (a.currency.family !== 'ethereum') return Promise.resolve(t)
  const tAccount = getTransactionAccount(a, t)
  const addr = tAccount.type === 'TokenAccount' ? tAccount.token.contractAddress : t.recipient
  if (!addr || t.gasLimit) return Promise.resolve(t)
  return estimateGasLimitForERC20(a.currency, addr)
    .then(str => BigNumber(str), () => BigNumber(0x5208))
    .then(gasLimit => (t.gasLimit && BigNumber(t.gasLimit).eq(gasLimit) ? t : { ...t, gasLimit }))
}

export const accountBridge: AccountBridge<Transaction> = {
  startSync,
  checkValidRecipient,
  createTransaction,
  fetchTransactionNetworkInfo,
  getTransactionNetworkInfo,
  applyTransactionNetworkInfo,
  editTokenAccountId,
  getTokenAccountId,
  editTransactionAmount,
  getTransactionAmount,
  editTransactionRecipient,
  getTransactionRecipient,
  editTransactionExtra,
  getTransactionExtra,
  checkValidTransaction,
  getTotalSpent,
  getMaxAmount,
  signAndBroadcast,
  prepareTransaction,
}
