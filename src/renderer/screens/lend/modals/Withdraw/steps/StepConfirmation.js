// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { multiline } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";

import type { StepProps } from "../types";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";

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
  transactionError,
  theme,
  device,
  signed,
}: StepProps & { theme: * }) {
  const currency = getAccountCurrency(account);
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage
          category="Lend"
          name="Withdraw Step 3 Success"
          eventProperties={{ currencyName: currency.name }}
        />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey="lend.withdraw.steps.confirmation.success.title" />}
          description={multiline(t("lend.withdraw.steps.confirmation.success.text"))}
        />
      </Container>
    );
  }

  if (transactionError) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage
          category="Lend"
          name="Withdraw Step 3 Fail"
          eventProperties={{ currencyName: currency.name }}
        />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="lend.withdraw.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={transactionError} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  account,
  parentAccount,
  onRetry,
  optimisticOperation,
  transactionError,
  openModal,
  onClose,
  transitionTo,
  t,
}: StepProps) {
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null;
  return (
    <Box horizontal justifyContent="flex-end">
      <Button ml={2} event="Lending Flow Step 4 Close Clicked" onClick={onClose} secondary>
        {t("lend.withdraw.steps.confirmation.success.done")}
      </Button>
      {concernedOperation ? (
        // FIXME make a standalone component!
        <Button
          ml={2}
          id={"lend-withdraw-confirmation-opc-button"}
          event="Lending Flow Withdraw Step 3 View OpD Clicked"
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
          primary
        >
          {t("lend.withdraw.steps.confirmation.success.cta")}
        </Button>
      ) : transactionError ? (
        <RetryButton ml={2} primary onClick={onRetry} />
      ) : null}
    </Box>
  );
}

export default withTheme(StepConfirmation);
