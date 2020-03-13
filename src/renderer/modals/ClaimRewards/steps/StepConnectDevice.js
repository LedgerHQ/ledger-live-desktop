// @flow

import React from "react";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";
import type { Device } from "~/renderer/reducers/devices";
import type { SignedOperation } from "@ledgerhq/live-common/lib/types";

import DeviceAction from "~/renderer/components/DeviceAction";
import StepProgress from "~/renderer/components/StepProgress";
import { action } from "~/renderer/components/DeviceAction/actions/transaction";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";

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
