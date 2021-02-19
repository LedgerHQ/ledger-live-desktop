// @flow

import React, { useCallback, useEffect, useContext } from "react";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";

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
import { useActiveFlow } from "~/renderer/components/ProductTour/hooks";

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
  optimisticOperation,
  error,
  theme,
  device,
  signed,
}: StepProps & { theme: * }) {
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Send Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey="send.steps.confirmation.success.title" />}
          description={multiline(t("send.steps.confirmation.success.text"))}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Send Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="send.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  t,
  transitionTo,
  account,
  parentAccount,
  onRetry,
  optimisticOperation,
  error,
  openModal,
  closeModal,
}: StepProps) {
  const activeFlow = useActiveFlow();
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null;

  const onOpenOperationDetails = useCallback(() => {
    closeModal();
    if (account && concernedOperation) {
      openModal("MODAL_OPERATION_DETAILS", {
        operationId: concernedOperation.id,
        accountId: account.id,
        parentId: parentAccount && parentAccount.id,
      });
    }
  }, [account, closeModal, concernedOperation, openModal, parentAccount]);

  const { send } = useContext(ProductTourContext);

  useEffect(() => {
    if (!error && concernedOperation && activeFlow === "send") {
      send("COMPLETE_FLOW", {
        extras: { congratulationsCallback: onOpenOperationDetails },
      });
      closeModal();
    }
  }, [activeFlow, closeModal, concernedOperation, error, onOpenOperationDetails, send]);

  return (
    <>
      {concernedOperation ? (
        // FIXME make a standalone component!
        <Button
          ml={2}
          id={"send-confirmation-opc-button"}
          event="Send Flow Step 4 View OpD Clicked"
          onClick={onOpenOperationDetails}
          primary
        >
          {t("send.steps.confirmation.success.cta")}
        </Button>
      ) : error ? (
        <RetryButton
          ml={2}
          primary
          onClick={() => {
            onRetry();
            transitionTo("summary");
          }}
        />
      ) : null}
    </>
  );
}

export default withTheme(StepConfirmation);
