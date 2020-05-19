// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";
import Button from "~/renderer/components/Button";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import RetryButton from "~/renderer/components/RetryButton";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import { multiline } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "../types";

export default function StepConfirmation({
  account,
  optimisticOperation,
  error,
  device,
  signed,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  console.log(transaction, account);

  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Undelegation Cosmos Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={t("cosmos.undelegation.flow.steps.confirmation.success.title")}
          description={multiline(
            t("cosmos.undelegation.flow.steps.confirmation.success.description"),
          )}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Undelegation Cosmos Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={t("cosmos.undelegation.flow.steps.confirmation.broadcastError")}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
`;

export function StepConfirmationFooter({
  account,
  error,
  onClose,
  onRetry,
  openModal,
  optimisticOperation,
}: StepProps) {
  const { t } = useTranslation();

  const onViewDetails = useCallback(() => {
    onClose();
    if (account && optimisticOperation) {
      openModal("MODAL_OPERATION_DETAILS", {
        operationId: optimisticOperation.id,
        accountId: account.id,
      });
    }
  }, [onClose, openModal, account, optimisticOperation]);

  return (
    <Box horizontal alignItems="right">
      <Button ml={2} onClick={onClose}>
        {t("common.close")}
      </Button>
      {optimisticOperation ? (
        // FIXME make a standalone component!
        <Button
          primary
          ml={2}
          event="Undelegation Cosmos Flow Step 3 View OpD Clicked"
          onClick={onViewDetails}
        >
          {t("cosmos.undelegation.flow.steps.confirmation.success.cta")}
        </Button>
      ) : error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : null}
    </Box>
  );
}
