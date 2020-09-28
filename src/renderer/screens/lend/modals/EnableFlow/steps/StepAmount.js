// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ErrorBanner from "~/renderer/components/ErrorBanner";

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");

  // const bridge = getAccountBridge(account, parentAccount);

  //  const onChange = useCallback(
  //    (resource: string) =>
  //      onChangeTransaction(
  //        bridge.updateTransaction(transaction, {
  //          resource,
  //        }),
  //      ),
  //    [bridge, transaction, onChangeTransaction],
  //  );

  return (
    <Box flow={1}>
      <TrackPage category="Lending Enable Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box vertical></Box>
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
