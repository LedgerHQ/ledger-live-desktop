// @flow

import React from "react";
import { Trans } from "react-i18next";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import type { SignedOperation } from "@ledgerhq/live-common/lib/types";
import type { StepProps } from "../types";
import type { Device } from "~/renderer/reducers/devices";
import DeviceAction from "~/renderer/components/DeviceAction";
import StepProgress from "~/renderer/components/StepProgress";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";
import { command } from "~/renderer/commands";

const connectAppExec = command("connectApp");
const action = createAction(connectAppExec);

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
      <Trans i18nKey="claimReward.steps.confirmation.pending.title" />
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
}: StepProps) {
  const broadcast = useBroadcast({ account, parentAccount });

  if (!transaction || !account) return null;

  return (
    <DeviceAction
      action={action}
      request={{
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
