// @flow
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import { toExchangeRaw } from "@ledgerhq/live-common/lib/swap/serialization";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { createAction as initSwapCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSwap";
import { Trans } from "react-i18next";
import type { SignedOperation } from "@ledgerhq/live-common/lib/types";
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
  onContinue,
  onError,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  onContinue: any,
  onError: any,
}) => {
  const device = useSelector(getCurrentDevice);
  const { exchange, exchangeRate } = swap;
  const { fromAccount: account, fromParentAccount: parentAccount } = exchange;

  const broadcast = useBroadcast({ account, parentAccount });
  const [swapData, setSwapData] = useState(false);

  const tokenCurrency = account && account.type === "TokenAccount" && account.token;

  return !swapData ? (
    <DeviceAction
      action={action2}
      request={{ exchange, exchangeRate, device }}
      onResult={({ initSwapResult, initSwapError, ...rest }) => {
        if (initSwapError) {
          onError(initSwapError);
        } else {
          debugger;
          setSwapData(initSwapResult);
        }
      }}
    />
  ) : (
    <div>{"WADUS"}</div>
    // <DeviceAction
    //   action={action}
    //   request={{
    //     tokenCurrency,
    //     parentAccount,
    //     account,
    //     transaction: swapData.transaction,
    //     status,
    //   }}
    //   Result={Result}
    //   onResult={({ signedOperation, transactionSignError }) => {
    //     const { swapId } = swapData;
    //     if (signedOperation) {
    //       broadcast(signedOperation).then(
    //         operation => {
    //           onContinue({
    //             operation,
    //             status: { swapId },
    //           });
    //         },
    //         error => {
    //           onError(error);
    //         },
    //       );
    //     }
    //   }}
    // />
  );
};

export default StepDevice;
