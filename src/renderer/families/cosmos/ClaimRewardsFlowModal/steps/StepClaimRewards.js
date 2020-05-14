// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

export default function StepClaimRewards({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction && transaction.validators, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const updateClaimRewards = useCallback(
    updater => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          // validators: updater(transaction.validators || []),
        }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="ClaimRewards Flow" name="Step 1" />
    </Box>
  );
}

export function StepClaimRewardsFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  // @TODO add in the support popover info
  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
