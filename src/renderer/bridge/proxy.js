/* eslint-disable flowtype/generic-spacing */
// @flow

import { BigNumber } from "bignumber.js";
import { map } from "rxjs/operators";
import type {
  CryptoCurrency,
  Account,
  AccountLike,
  CurrencyBridge,
  AccountBridge,
} from "@ledgerhq/live-common/lib/types";
import isEqual from "lodash/isEqual";
import {
  fromTransactionRaw,
  toTransactionRaw,
  toSignedOperationRaw,
  fromTransactionStatusRaw,
  fromSignOperationEventRaw,
} from "@ledgerhq/live-common/lib/transaction";
import {
  toAccountLikeRaw,
  toAccountRaw,
  fromOperationRaw,
} from "@ledgerhq/live-common/lib/account";
import { patchAccount } from "@ledgerhq/live-common/lib/reconciliation";
import { fromScanAccountEventRaw } from "@ledgerhq/live-common/lib/bridge";
import * as bridgeImpl from "@ledgerhq/live-common/lib/bridge/impl";
import { command } from "~/renderer/commands";

const scanAccounts = ({ currency, deviceId, syncConfig }) =>
  command("CurrencyScanAccounts")({
    currencyId: currency.id,
    deviceId,
    syncConfig,
  }).pipe(map(fromScanAccountEventRaw));

export const getCurrencyBridge = (currency: CryptoCurrency): CurrencyBridge => {
  const bridge = bridgeImpl.getCurrencyBridge(currency);
  const bridgeGetPreloadStrategy = bridge.getPreloadStrategy;
  const getPreloadStrategy = bridgeGetPreloadStrategy
    ? currency => bridgeGetPreloadStrategy.call(bridge, currency)
    : undefined;
  const b: CurrencyBridge = {
    preload: async () => {
      const value = await command("CurrencyPreload")({ currencyId: currency.id }).toPromise();
      bridgeImpl.getCurrencyBridge(currency).hydrate(value, currency);
      return value;
    },

    hydrate: value => bridgeImpl.getCurrencyBridge(currency).hydrate(value, currency),

    scanAccounts,
  };

  if (getPreloadStrategy) {
    b.getPreloadStrategy = getPreloadStrategy;
  }

  return b;
};

export const getAccountBridge = (
  account: AccountLike,
  parentAccount: ?Account,
): AccountBridge<any> => {
  const sync = (account, syncConfig) =>
    command("AccountSync")({
      account: toAccountRaw(account),
      syncConfig,
    }).pipe(map(raw => account => patchAccount(account, raw)));

  const receive = (account, arg) =>
    command("AccountReceive")({
      account: toAccountRaw(account),
      arg,
    });

  const createTransaction = a =>
    bridgeImpl.getAccountBridge(account, parentAccount).createTransaction(a);

  const updateTransaction = (a, patch) =>
    bridgeImpl.getAccountBridge(account, parentAccount).updateTransaction(a, patch);

  const prepareTransaction = async (a, t) => {
    const transaction = toTransactionRaw(t);
    const result = await command("AccountPrepareTransaction")({
      account: toAccountRaw(a),
      transaction,
    }).toPromise();

    // this will remove the `undefined` fields due to JSON back&forth
    const sentTransaction = JSON.parse(JSON.stringify(transaction));
    if (isEqual(sentTransaction, result)) {
      return t; // preserve reference by deep equality of the TransactionRaw
    }
    return fromTransactionRaw(result);
  };

  const getTransactionStatus = (a, t) =>
    command("AccountGetTransactionStatus")({
      account: toAccountRaw(a),
      transaction: toTransactionRaw(t),
    })
      .toPromise()
      .then(fromTransactionStatusRaw);

  const signOperation = ({ account, transaction, deviceId }) =>
    command("AccountSignOperation")({
      account: toAccountRaw(account),
      transaction: toTransactionRaw(transaction),
      deviceId,
    }).pipe(map(raw => fromSignOperationEventRaw(raw, account.id)));

  const broadcast = ({ account, signedOperation }) =>
    command("AccountBroadcast")({
      account: toAccountRaw(account),
      signedOperation: toSignedOperationRaw(signedOperation, true),
    })
      .pipe(map(raw => fromOperationRaw(raw, account.id)))
      .toPromise();

  const estimateMaxSpendable = ({ account, parentAccount, transaction }) =>
    command("AccountEstimateMaxSpendable")({
      account: toAccountLikeRaw(account),
      parentAccount: parentAccount ? toAccountRaw(parentAccount) : null,
      transaction: transaction ? toTransactionRaw(transaction) : null,
    })
      .pipe(map(raw => BigNumber(raw)))
      .toPromise();

  return {
    createTransaction,
    updateTransaction,
    getTransactionStatus,
    prepareTransaction,
    sync,
    receive,
    signOperation,
    broadcast,
    estimateMaxSpendable,
  };
};
