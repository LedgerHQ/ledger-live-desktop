// @flow
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { createAction as initSwapCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSwap";
import { Trans } from "react-i18next";
import type { SignedOperation, Transaction } from "@ledgerhq/live-common/lib/types";
import type { Device } from "~/renderer/reducers/devices";
import StepProgress from "~/renderer/components/StepProgress";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/swap/types";
const connectAppExec = command("connectApp");
const initSwapExec = command("initSwap");

const action = createAction(connectAppExec);
const action2 = initSwapCreateAction(connectAppExec, initSwapExec);

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
      <Trans i18nKey="send.steps.confirmation.pending.title" />
    </StepProgress>
  );
};

const StepDevice = ({
  swap,
  transaction,
  onContinue,
  onError,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: Transaction,
  onContinue: any,
  onError: any,
}) => {
  const device = useSelector(getCurrentDevice);
  const { exchange, exchangeRate } = swap;
  const { fromAccount: account, fromParentAccount: parentAccount } = exchange;

  const broadcast = useBroadcast({ account, parentAccount });
  const [swapData, setSwapData] = useState(null);
  const [signedOperation, setSignedOperation] = useState(false);
  const tokenCurrency = account && account.type === "TokenAccount" ? account.token : null;

  useEffect(() => {
    if (swapData && signedOperation) {
      const { swapId } = swapData;
      broadcast(signedOperation).then(
        operation => {
          onContinue({
            operation,
            status: { swapId },
          });
        },
        error => {
          onError(error);
        },
      );
    }
  }, [broadcast, onContinue, onError, signedOperation, swapData]);

  return signedOperation ? (
    <div>{"Broadcasting operation"}</div>
  ) : !swapData ? (
    <DeviceAction
      action={action2}
      request={{ exchange, exchangeRate, transaction, device }}
      onResult={({ initSwapResult, initSwapError, ...rest }) => {
        if (initSwapError) {
          onError(initSwapError);
        } else {
          setSwapData(initSwapResult);
        }
      }}
    />
  ) : (
    <DeviceAction
      action={action}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        transaction: swapData.transaction,
        status,
        appName: "Exchange", // TODO move to live-common maybe
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (transactionSignError) {
          onError(transactionSignError);
        } else {
          setSignedOperation(signedOperation);
        }
      }}
    />
  );
};

export default StepDevice;
