// @flow
import invariant from "invariant";
import React from "react";
import { useDispatch } from "react-redux";
import styled, { withTheme } from "styled-components";
import { Trans } from "react-i18next";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import { multiline } from "~/renderer/styles/helpers";
import { openModal } from "~/renderer/actions/modals";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer//linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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

const StepConfirmation = ({
  account,
  t,
  optimisticOperation,
  error,
  signed,
  transaction,
  eventType,
}: StepProps) => {
  invariant(
    transaction && transaction.family === "tezos",
    "transaction is required and must be of tezos family",
  );

  const undelegating = transaction.mode === "undelegate";

  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage
          category={`Delegation Flow${eventType ? ` (${eventType})` : ""}`}
          name="Step Confirmed"
        />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={
            <Trans
              i18nKey={`delegation.flow.steps.confirmation.success.${
                undelegating ? "titleUndelegated" : "title"
              }`}
            />
          }
          description={multiline(
            t(
              `delegation.flow.steps.confirmation.success.${
                undelegating ? "textUndelegated" : "text"
              }`,
            ),
          )}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Delegation Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="delegation.flow.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
};

export const StepConfirmationFooter = ({
  t,
  transitionTo,
  account,
  parentAccount,
  onRetry,
  optimisticOperation,
  error,
  closeModal,
}: StepProps) => {
  const dispatch = useDispatch();
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null;
  return (
    <>
      <Box mr={2} ff="Inter|SemiBold" fontSize={4}>
        <LinkWithExternalIcon
          label={<Trans i18nKey="delegation.howItWorks" />}
          onClick={() => openURL(urls.stakingTezos)}
        />
      </Box>
      {concernedOperation ? (
        <Button
          ml={2}
          id={"delegate-confirmation-details-button"}
          event="Delegation Flow Step 4 View OpD Clicked"
          onClick={() => {
            closeModal();
            if (account && concernedOperation) {
              dispatch(
                openModal("MODAL_OPERATION_DETAILS", {
                  operationId: concernedOperation.id,
                  accountId: account.id,
                  parentId: parentAccount && parentAccount.id,
                }),
              );
            }
          }}
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
};

export default withTheme(StepConfirmation);
