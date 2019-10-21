/* eslint-disable flowtype/generic-spacing */
// @flow

import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import type {
  CryptoCurrency,
  AccountRaw,
  Account,
  AccountLike,
  CurrencyBridge,
  AccountBridge,
  TransactionStatus,
  TransactionStatusRaw,
  TransactionRaw,
  SignAndBroadcastEventRaw,
  ScanAccountEventRaw,
} from '@ledgerhq/live-common/lib/types'
import isEqual from 'lodash/isEqual'
import {
  fromTransactionRaw,
  toTransactionRaw,
  toTransactionStatusRaw,
  fromTransactionStatusRaw,
  toSignAndBroadcastEventRaw,
  fromSignAndBroadcastEventRaw,
} from '@ledgerhq/live-common/lib/transaction'
import { inferDeprecatedMethods } from '@ledgerhq/live-common/lib/bridge/deprecationUtils'
import { fromAccountRaw, toAccountRaw } from '@ledgerhq/live-common/lib/account'
import { patchAccount } from '@ledgerhq/live-common/lib/reconciliation'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { toScanAccountEventRaw, fromScanAccountEventRaw } from '@ledgerhq/live-common/lib/bridge'
import * as bridgeImpl from '@ledgerhq/live-common/lib/bridge/impl'
import { createCommand, Command } from 'helpers/ipc'

const cmdCurrencyScanAccountsOnDevice: Command<
  { currencyId: string, deviceId: string },
  ScanAccountEventRaw,
> = createCommand('CurrencyScanAccountsOnDevice', o => {
  const currency = getCryptoCurrencyById(o.currencyId)
  const bridge = bridgeImpl.getCurrencyBridge(currency)
  return bridge.scanAccountsOnDevice(currency, o.deviceId).pipe(map(toScanAccountEventRaw))
})

export const getCurrencyBridge = (_currency: CryptoCurrency): CurrencyBridge => ({
  scanAccountsOnDevice: (currency, deviceId) =>
    cmdCurrencyScanAccountsOnDevice
      .send({
        currencyId: currency.id,
        deviceId,
      })
      .pipe(map(fromScanAccountEventRaw)),
})

const cmdAccountStartSync: Command<
  {
    account: AccountRaw,
    observation: boolean,
  },
  AccountRaw,
> = createCommand('AccountStartSync', o => {
  const account = fromAccountRaw(o.account)
  const bridge = bridgeImpl.getAccountBridge(account, null)
  return bridge.startSync(account, o.observation).pipe(map(f => toAccountRaw(f(account))))
})

const cmdAccountPrepareTransaction: Command<
  {
    account: AccountRaw,
    transaction: TransactionRaw,
  },
  TransactionRaw,
> = createCommand('AccountPrepareTransaction', o => {
  const account = fromAccountRaw(o.account)
  const transaction = fromTransactionRaw(o.transaction)
  const bridge = bridgeImpl.getAccountBridge(account, null)
  return from(bridge.prepareTransaction(account, transaction).then(toTransactionRaw))
})

const cmdAccountGetTransactionStatus: Command<
  {
    account: AccountRaw,
    transaction: TransactionRaw,
  },
  TransactionStatusRaw,
> = createCommand('AccountGetTransactionStatus', o => {
  const account = fromAccountRaw(o.account)
  const transaction = fromTransactionRaw(o.transaction)
  const bridge = bridgeImpl.getAccountBridge(account, null)
  return from(
    bridge
      .getTransactionStatus(account, transaction)
      .then((raw: TransactionStatus) => toTransactionStatusRaw(raw)),
  )
})

const cmdAccountSignAndBroadcast: Command<
  {
    account: AccountRaw,
    transaction: TransactionRaw,
    deviceId: string,
  },
  SignAndBroadcastEventRaw,
> = createCommand('AccountSignAndBroadcast', o => {
  const account = fromAccountRaw(o.account)
  const transaction = fromTransactionRaw(o.transaction)
  const bridge = bridgeImpl.getAccountBridge(account, null)
  return bridge
    .signAndBroadcast(account, transaction, o.deviceId)
    .pipe(map(toSignAndBroadcastEventRaw))
})

export const getAccountBridge = (
  account: AccountLike,
  parentAccount: ?Account,
): AccountBridge<any> => {
  const startSync = (account, observation) =>
    cmdAccountStartSync
      .send({
        account: toAccountRaw(account),
        observation,
      })
      .pipe(map(raw => account => patchAccount(account, raw)))

  const createTransaction = a =>
    bridgeImpl.getAccountBridge(account, parentAccount).createTransaction(a)

  const updateTransaction = (a, patch) =>
    bridgeImpl.getAccountBridge(account, parentAccount).updateTransaction(a, patch)

  const getCapabilities = a =>
    bridgeImpl.getAccountBridge(account, parentAccount).getCapabilities(a)

  const prepareTransaction = async (a, t) => {
    const transaction = toTransactionRaw(t)
    const result = await cmdAccountPrepareTransaction
      .send({
        account: toAccountRaw(a),
        transaction,
      })
      .toPromise()

    // this will remove the `undefined` fields due to JSON back&forth
    const sentTransaction = JSON.parse(JSON.stringify(transaction))
    if (isEqual(sentTransaction, result)) {
      return t // preserve reference by deep equality of the TransactionRaw
    }
    return fromTransactionRaw(result)
  }

  const getTransactionStatus = (a, t) =>
    cmdAccountGetTransactionStatus
      .send({
        account: toAccountRaw(a),
        transaction: toTransactionRaw(t),
      })
      .toPromise()
      .then(fromTransactionStatusRaw)

  const signAndBroadcast = (a, t, deviceId) =>
    cmdAccountSignAndBroadcast
      .send({
        account: toAccountRaw(a),
        transaction: toTransactionRaw(t),
        deviceId,
      })
      .pipe(map(raw => fromSignAndBroadcastEventRaw(raw, a.id)))

  return {
    createTransaction,
    updateTransaction,
    getTransactionStatus,
    prepareTransaction,
    startSync,
    signAndBroadcast,
    getCapabilities,
    ...inferDeprecatedMethods({
      name: 'DesktopBridgeProxy',
      createTransaction,
      getTransactionStatus,
      prepareTransaction,
    }),
  }
}

export const commands = [
  cmdAccountStartSync,
  cmdAccountGetTransactionStatus,
  cmdAccountPrepareTransaction,
  cmdAccountSignAndBroadcast,
  cmdCurrencyScanAccountsOnDevice,
]
