// @flow
import React, { useEffect, useCallback } from "react";
import { Trans } from "react-i18next";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  SignOperationEvent,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "~/renderer/reducers/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import TransactionConfirm from "~/renderer/components/TransactionConfirm";
import StepProgress from "~/renderer/components/StepProgress";

type StepProps = {
  transitionTo: string => void,
  device: ?Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  signTransaction: ({ transitionTo: string => void }) => void,
  lastSignOperationEvent: ?SignOperationEvent,
};

const StepVerification = ({
  signTransaction,
  transitionTo,
  device,
  account,
  parentAccount,
  transaction,
  status,
  lastSignOperationEvent,
}: StepProps) => {
  const handleSignTransaction = useCallback(async () => {
    signTransaction({ transitionTo });
  }, [signTransaction, transitionTo]);

  // didMount
  // this was done only on mount on v1, so I removed the
  // dependencies to simulate that (val)
  useEffect(() => {
    handleSignTransaction();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!account || !device || !transaction) return null;
  return (
    <>
      <TrackPage category="Send Flow" name="Step Verification" />

      {lastSignOperationEvent && lastSignOperationEvent.type === "device-signature-requested" ? (
        // we need to ask user to confirm the details
        <TransactionConfirm
          device={device}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          status={status}
        />
      ) : (
        <StepProgress modelId={device.modelId}>
          {lastSignOperationEvent && lastSignOperationEvent.type === "device-streaming" ? (
            // with streaming event, we have accurate version of the wording
            <Trans
              i18nKey="send.steps.verification.streaming.accurate"
              values={{ percentage: (lastSignOperationEvent.progress * 100).toFixed(0) + "%" }}
            />
          ) : (
            // otherwise, we're not accurate (usually because we don't need to, it's fast case)
            <Trans i18nKey="send.steps.verification.streaming.inaccurate" />
          )}
        </StepProgress>
      )}
    </>
  );
};

export default StepVerification;
