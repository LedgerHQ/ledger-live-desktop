// @flow
import invariant from "invariant";
import React, { useCallback } from "react";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Alert from "~/renderer/components/Alert";

import AmountField from "../fields/AmountField";
import ResourceField from "../fields/ResourceField";

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const { resource } = transaction;

  const setFrozenResource = useCallback(
    (resource: string) => {
      onChangeTransaction(bridge.updateTransaction(transaction, { resource }));
    },
    [bridge, transaction, onChangeTransaction],
  );

  return (
    <Box flow={1}>
      <SyncSkipUnderPriority priority={100} />
      <TrackPage category="Freeze Flow" name="Step 1" />
      <ResourceField resource={resource || "BANDWITH"} onChange={setFrozenResource} />
      <AmountField
        transaction={transaction}
        account={account}
        parentAccount={parentAccount}
        bridgePending={bridgePending}
        onChangeTransaction={onChangeTransaction}
        status={status}
        t={t}
      />
      <Alert type="primary" my={4}>
        <Trans i18nKey="freeze.steps.amount.info" />
      </Alert>
    </Box>
  );
}

export function StepAmountFooter({
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

  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
