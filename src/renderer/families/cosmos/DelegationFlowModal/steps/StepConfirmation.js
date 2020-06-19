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
`;

function StepConfirmation({
  account,
  t,
  optimisticOperation,
  error,
  theme,
  device,
  signed,
}: StepProps & { theme: * }) {
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Delegation Cosmos" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey="cosmos.delegation.flow.steps.confirmation.success.title" />}
          description={multiline(t("cosmos.delegation.flow.steps.confirmation.success.text"))}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Delegation Cosmos" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="cosmos.delegation.flow.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  transitionTo,
  account,
  parentAccount,
  onRetry,
  error,
  openModal,
  onClose,
  optimisticOperation,
  transaction,
}: StepProps) {
  const concernedOperation =
    transaction?.validators.length === 1 && optimisticOperation
      ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
        ? optimisticOperation.subOperations[0]
        : optimisticOperation
      : null;

  return (
    <Box horizontal alignItems="right">
      <Button id="modal-close-button" ml={2} onClick={onClose}>
        <Trans i18nKey="common.close" />
      </Button>
      {concernedOperation ? (
        // FIXME make a standalone component!
        <Button
          primary
          ml={2}
          event="Vote Flow Step 3 View OpD Clicked"
          onClick={() => {
            onClose();
            if (account && concernedOperation) {
              openModal("MODAL_OPERATION_DETAILS", {
                operationId: concernedOperation.id,
                accountId: account.id,
                parentId: parentAccount && parentAccount.id,
              });
            }
          }}
        >
          <Trans i18nKey="cosmos.delegation.flow.steps.confirmation.success.cta" />
        </Button>
      ) : error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : null}
    </Box>
  );
}

export default withTheme(StepConfirmation);
