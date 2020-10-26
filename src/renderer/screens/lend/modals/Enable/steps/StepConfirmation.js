// @flow

import React, { useCallback } from "react";
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
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";

import type { StepProps } from "../types";
import Update from "~/renderer/icons/UpdateCircle";
import InfoBox from "~/renderer/components/InfoBox";

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
  min-height: 220px;
`;

const IconContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  width: 56,
  height: 56,
  borderRadius: "50%",
  bg: "blueTransparentBackground",
  justifyContent: "center",
  alignItems: "center",
  color: "wallet",
  mb: 2,
}))``;

const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  mt: 2,
}))`
  text-align: center;
  word-break: break-word;
`;

const Text: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
  mt: 2,
  mb: 4,
}))`
  text-align: center;
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
  const onLearnMore = useCallback(() => {
    // @TODO redirect to support page
  }, []);

  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Lending Enable Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <IconContainer>
          <Update size={24} />
        </IconContainer>
        <Title>
          <Trans i18nKey="lend.enable.steps.confirmation.success.title" />
        </Title>
        <Text>{multiline(t("lend.enable.steps.confirmation.success.text"))}</Text>
        <InfoBox onLearnMore={onLearnMore}>
          <Trans i18nKey="lend.enable.steps.confirmation.success.info" />
        </InfoBox>
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Lending Enable Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="lend.enable.steps.confirmation.broadcastError" />}
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
  openModal,
  onClose,
  transitionTo,
  t,
}: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button ml={2} event="Lending Flow Step 4 Close Clicked" onClick={onClose} secondary>
        {t("lend.enable.steps.confirmation.success.done")}
      </Button>
      {error ? <RetryButton ml={2} primary onClick={onRetry} /> : null}
    </Box>
  );
}

export default withTheme(StepConfirmation);
