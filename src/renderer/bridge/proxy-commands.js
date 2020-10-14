/* eslint-disable flowtype/generic-spacing */
// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import type {
  AccountRawLike,
  AccountRaw,
  TransactionStatus,
  TransactionStatusRaw,
  TransactionRaw,
  SyncConfig,
  ScanAccountEventRaw,
  SignOperationEventRaw,
  SignedOperationRaw,
  OperationRaw,
} from "@ledgerhq/live-common/lib/types";
import {
  fromTransactionRaw,
  toTransactionRaw,
  toTransactionStatusRaw,
  fromSignedOperationRaw,
  toSignOperationEventRaw,
} from "@ledgerhq/live-common/lib/transaction";
import {
  fromAccountRaw,
  fromAccountLikeRaw,
  toAccountRaw,
  toOperationRaw,
} from "@ledgerhq/live-common/lib/account";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { toScanAccountEventRaw } from "@ledgerhq/live-common/lib/bridge";
import * as bridgeImpl from "@ledgerhq/live-common/lib/bridge/impl";

const cmdCurrencyPreload = ({ currencyId }: { currencyId: string }): Observable<mixed> => {
  const currency = getCryptoCurrencyById(currencyId);
  return from(bridgeImpl.getCurrencyBridge(currency).preload(currency));
};

const cmdCurrencyScanAccounts = (o: {
  currencyId: string,
  deviceId: string,
  syncConfig: SyncConfig,
}): Observable<ScanAccountEventRaw> => {
  const currency = getCryptoCurrencyById(o.currencyId);
  const bridge = bridgeImpl.getCurrencyBridge(currency);
  return bridge
    .scanAccounts({
      currency,
      deviceId: o.deviceId,
      syncConfig: o.syncConfig,
    })
    .pipe(map(toScanAccountEventRaw));
};

const cmdAccountReceive = (o: {
  account: AccountRaw,
  arg: {
    deviceId: string,
    subAccountId?: string,
    verify?: boolean,
  },
}): Observable<{ address: string, path: string }> => {
  const account = fromAccountRaw(o.account);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return bridge.receive(account, o.arg);
};

const cmdAccountSync = (o: {
  account: AccountRaw,
  syncConfig: SyncConfig,
}): Observable<AccountRaw> => {
  const account = fromAccountRaw(o.account);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return bridge.sync(account, o.syncConfig).pipe(map(f => toAccountRaw(f(account))));
};

const cmdAccountPrepareTransaction = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
}): Observable<TransactionRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return from(bridge.prepareTransaction(account, transaction).then(toTransactionRaw));
};

const cmdAccountGetTransactionStatus = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
}): Observable<TransactionStatusRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return from(
    bridge
      .getTransactionStatus(account, transaction)
      .then((raw: TransactionStatus) => toTransactionStatusRaw(raw)),
  );
};

const cmdAccountSignOperation = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
  deviceId: string,
}): Observable<SignOperationEventRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return bridge
    .signOperation({ account, transaction, deviceId: o.deviceId })
    .pipe(map(toSignOperationEventRaw));
};

const cmdAccountBroadcast = (o: {
  account: AccountRaw,
  signedOperation: SignedOperationRaw,
}): Observable<OperationRaw> => {
  const account = fromAccountRaw(o.account);
  const signedOperation = fromSignedOperationRaw(o.signedOperation, account.id);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return from(bridge.broadcast({ account, signedOperation }).then(o => toOperationRaw(o, true)));
};

const cmdAccountEstimateMaxSpendable = (o: {
  account: AccountRawLike,
  parentAccount: ?AccountRaw,
  transaction: ?TransactionRaw,
}): Observable<OperationRaw> => {
  const account = fromAccountLikeRaw(o.account);
  const parentAccount = o.parentAccount ? fromAccountRaw(o.parentAccount) : null;
  const transaction = o.transaction ? fromTransactionRaw(o.transaction) : null;
  const bridge = bridgeImpl.getAccountBridge(account, parentAccount);
  return from(
    bridge.estimateMaxSpendable({ account, parentAccount, transaction }).then(o => o.toString()),
  );
};

export const commands = {
  CurrencyPreload: cmdCurrencyPreload,
  AccountSync: cmdAccountSync,
  AccountReceive: cmdAccountReceive,
  AccountGetTransactionStatus: cmdAccountGetTransactionStatus,
  AccountPrepareTransaction: cmdAccountPrepareTransaction,
  AccountSignOperation: cmdAccountSignOperation,
  AccountBroadcast: cmdAccountBroadcast,
  CurrencyScanAccounts: cmdCurrencyScanAccounts,
  AccountEstimateMaxSpendable: cmdAccountEstimateMaxSpendable,
};
