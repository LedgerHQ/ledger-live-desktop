// @flow

import React from "react";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  SignedOperation,
} from "@ledgerhq/live-common/lib/types";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const Result = ({
  signedOperation,
  device,
}: {
  signedOperation: ?SignedOperation,
  device: Device,
}) => {
  return null;
};

export default function StepConnectDevice({
  account,
  parentAccount,
  transaction,
  useApp,
  status,
  transitionTo,
  onTransactionSigned,
  onTransactionError,
}: {
  transitionTo: string => void,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  useApp?: string,
  status: TransactionStatus,
  onTransactionError: Error => void,
  onTransactionSigned: SignedOperation => void,
}) {
  const tokenCurrency = account && account.type === "TokenAccount" && account.token;

  if (!transaction || !account) return null;

  return (
    <DeviceAction
      action={action}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        appName: useApp,
        transaction,
        status,
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (signedOperation) {
          onTransactionSigned(signedOperation);
        } else if (transactionSignError) {
          onTransactionError(transactionSignError);
          transitionTo("confirmation");
        }
      }}
    />
  );
}
