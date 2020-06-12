// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { useSelector } from "react-redux";

import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";

import type { StepProps } from "../types";

import { localeSelector } from "~/renderer/reducers/settings";

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
  transaction,
}: StepProps & { theme: * }) {
  const { validators } = useCosmosPreloadData();
  const locale = useSelector(localeSelector);

  if (optimisticOperation) {
    const unit = account && getAccountUnit(account);

    const validator = transaction && transaction.validators ? transaction.validators[0] : null;

    const v =
      validator &&
      validators.find(({ validatorAddress }) => validatorAddress === validator.address);

    const amount =
      unit && validator && formatCurrencyUnit(unit, validator.amount, { showCode: true, locale });

    return (
      <Container>
        <TrackPage category="ClaimRewards Cosmos Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={
            <Trans
              i18nKey={`cosmos.claimRewards.flow.steps.confirmation.success.${
                transaction?.mode === "claimReward" ? "title" : "titleCompound"
              }`}
            />
          }
          description={
            <div>
              <Trans
                i18nKey={`cosmos.claimRewards.flow.steps.confirmation.success.${
                  transaction?.mode === "claimReward" ? "text" : "textCompound"
                }`}
                values={{ amount, validator: v && v.name }}
              >
                <b></b>
              </Trans>
            </div>
          }
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="ClaimRewards Cosmos Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="cosmos.claimRewards.flow.steps.confirmation.broadcastError" />}
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
}: StepProps) {
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null;

  return (
    <Box horizontal alignItems="right">
      <Button ml={2} onClick={onClose}>
        <Trans i18nKey="common.close" />
      </Button>
      {concernedOperation ? (
        // FIXME make a standalone component!
        <Button
          primary
          ml={2}
          event="ClaimRewards Cosmos Flow Step 3 View OpD Clicked"
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
          <Trans i18nKey="cosmos.claimRewards.flow.steps.confirmation.success.cta" />
        </Button>
      ) : error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : null}
    </Box>
  );
}

export default withTheme(StepConfirmation);
