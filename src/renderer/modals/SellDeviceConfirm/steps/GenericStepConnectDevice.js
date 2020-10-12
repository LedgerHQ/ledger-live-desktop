// @flow

import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "~/renderer/components/DeviceAction";
import StepProgress from "~/renderer/components/StepProgress";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";
import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
  SignedOperation,
} from "@ledgerhq/live-common/lib/types";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { DeviceBlocker } from "~/renderer/components/DeviceAction/DeviceBlocker";
import { createAction as initSellCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSell";
import { toAccountRaw } from "@ledgerhq/live-common/lib/account/serialization";
import { toTransactionStatusRaw } from "@ledgerhq/live-common/lib/transaction/status";

const checkSignatureAndPrepare = command("checkSignatureAndPrepare");
const connectAppExec = command("connectApp");
const initSellExec = command("getTransactionId");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const Result = ({
  signedOperation,
  device,
}: {
  signedOperation: ?SignedOperation,
  device: Device,
}) => {
  if (!signedOperation) return null;
  return (
    <StepProgress modelId={device.modelId}>
      <DeviceBlocker />
      <Trans i18nKey="send.steps.confirmation.pending.title" />
    </StepProgress>
  );
};

export default function StepConnectDevice({
  account,
  parentAccount,
  transaction,
  status,
  transitionTo,
  onOperationBroadcasted,
  onTransactionError,
  setSigned,
  setTransactionId,
}: {
  transitionTo: string => void,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  setSigned: boolean => void,
  setTransactionId: string => void,
}) {
  const broadcast = useBroadcast({ account, parentAccount });
  const tokenCurrency = account && account.type === "TokenAccount" && account.token;

  const action2 = useMemo(
    () =>
      initSellCreateAction(
        getEnv("MOCK") ? mockedEventEmitter : connectAppExec,
        getEnv("MOCK")
          ? mockedEventEmitter
          : ({ deviceId }) =>
              initSellExec({
                deviceId,
              }),
        ({ deviceId, transaction, binaryPayload, receiver, payloadSignature, account, status }) =>
          checkSignatureAndPrepare({
            deviceId,
            transaction: toTransactionRaw(transaction),
            binaryPayload,
            receiver,
            payloadSignature,
            account: toAccountRaw(account),
            status: toTransactionStatusRaw(status),
          }),
        setTransactionId,
      ),
    [setTransactionId],
  );

  // ({ exchange, exchangeRate, transaction, deviceId }) =>
  //         initSwapExec({
  //           exchange: toExchangeRaw(exchange),
  //           exchangeRate: toExchangeRateRaw(exchangeRate),
  //           transaction: toTransactionRaw(transaction),
  //           deviceId,
  //         })

  if (!transaction || !account) return null;

  return (
    <DeviceAction
      action={action2}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        transaction,
        status,
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (signedOperation) {
          setSigned(true);
          broadcast(signedOperation).then(
            operation => {
              onOperationBroadcasted(operation);
              transitionTo("confirmation");
            },
            error => {
              onTransactionError(error);
              transitionTo("confirmation");
            },
          );
        } else if (transactionSignError) {
          onTransactionError(transactionSignError);
          transitionTo("confirmation");
        }
      }}
    />
  );
}
