// @flow

import React, { useState, useEffect, useCallback } from "react";
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
  optimisticOperation,
  error,
  theme,
  device,
  signed,
}: StepProps & { theme: * }) {
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Freeze Flow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey="freeze.steps.confirmation.success.title" />}
          description={multiline(t("freeze.steps.confirmation.success.text"))}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Freeze Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="freeze.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

const useTimer = (timer: number) => {
  const [time, setTime] = useState(timer);

  useEffect(() => {
    let T = timer;
    const int = setInterval(() => {
      if (T <= 0) {
        clearInterval(int);
      } else {
        T--;
        setTime(T);
      }
    }, 1000);
    return () => {
      if (int) clearInterval(int);
    };
  }, [timer]);

  return time;
};

export function StepConfirmationFooter({
  t,
  transitionTo,
  account,
  onRetry,
  error,
  openModal,
  onClose,
}: StepProps) {
  const time = useTimer(60);

  const openVote = useCallback(() => {
    onClose();
    if (account) {
      const { tronResources } = account;
      const { votes } = tronResources || {};

      openModal(votes.length > 0 ? "MODAL_VOTE_TRON" : "MODAL_VOTE_TRON_INFO", {
        account: account,
      });
    }
  }, [account, onClose, openModal]);

  return error ? (
    <RetryButton ml={2} primary onClick={onRetry} />
  ) : (
    <>
      <Button ml={2} event="Freeze Flow Step 3 View OpD Clicked" onClick={onClose} secondary>
        <Trans i18nKey="freeze.steps.confirmation.success.later" />
      </Button>
      <Button ml={2} disabled={time > 0} primary onClick={openVote}>
        {time > 0 ? (
          <Trans i18nKey="freeze.steps.confirmation.success.votePending" values={{ time }} />
        ) : (
          <Trans i18nKey="freeze.steps.confirmation.success.vote" />
        )}
      </Button>
    </>
  );
}

export default withTheme(StepConfirmation);
