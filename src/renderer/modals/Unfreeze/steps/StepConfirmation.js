// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";

import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { multiline } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";

import type { StepProps } from "../types";

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
  min-height: 220px;
`;

function StepConfirmation({
  account,
  t,
  transaction,
  optimisticOperation,
  error,
  theme,
  device,
  signed,
}: StepProps & { theme: * }) {
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Unfreeze Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey="unfreeze.steps.confirmation.success.title" />}
          description={multiline(
            t("unfreeze.steps.confirmation.success.text", {
              resource: transaction && transaction.resource && transaction.resource.toLowerCase(),
            }),
          )}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Unfreeze Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="unfreeze.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  account,
  parentAccount,
  onRetry,
  error,
  onClose,
}: StepProps) {
  return error ? (
    <RetryButton ml={2} primary onClick={onRetry} />
  ) : (
    <Button ml={2} event="Unfreeze Flow Step 3 View OpD Clicked" onClick={onClose} primary>
      <Trans i18nKey="unfreeze.steps.confirmation.success.continue" />
    </Button>
  );
}

export default withTheme(StepConfirmation);
