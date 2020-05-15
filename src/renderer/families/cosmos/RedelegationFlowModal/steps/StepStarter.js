// @flow
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

export default function StepStarter({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && account.cosmosResources && transaction, "account and transaction required");
  return (
    <Box flow={1}>
      <TrackPage category="Starter Flow" name="Step 1" />
    </Box>
  );
}

export function StepStarterFooter({
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
        <Button disabled={!canNext} primary onClick={() => transitionTo("validators")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
