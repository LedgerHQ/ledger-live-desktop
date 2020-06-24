// @flow

import invariant from "invariant";
import { useSelector } from "react-redux";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { useTronPowerLoading } from "@ledgerhq/live-common/lib/families/tron/react";
import { useTimer } from "@ledgerhq/live-common/lib/hooks/useTimer";
import { accountSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { multiline } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";
import ToolTip from "~/renderer/components/Tooltip";
import Text from "~/renderer/components/Text";

import type { StepProps } from "../types";

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
  min-height: 220px;
`;

const TooltipContent = () => (
  <Box style={{ padding: 4 }}>
    <Text style={{ marginBottom: 5 }}>
      <Trans i18nKey="freeze.steps.confirmation.tooltip.title" />
    </Text>
    <Text>
      <Trans i18nKey="freeze.steps.confirmation.tooltip.desc" />
    </Text>
  </Box>
);

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
  const isEnergy = transaction && transaction.resource && transaction.resource === "ENERGY";

  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Freeze Flow" name="Step Confirmed" />
        <SuccessDisplay
          title={<Trans i18nKey="freeze.steps.confirmation.success.title" />}
          description={multiline(
            t(`freeze.steps.confirmation.success.${isEnergy ? "textNRG" : "text"}`),
          )}
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

export function StepConfirmationFooter({
  t,
  transitionTo,
  account: initialAccount,
  onRetry,
  error,
  openModal,
  onClose,
}: StepProps) {
  invariant(initialAccount, "tron account required");
  const account = useSelector(s => accountSelector(s, { accountId: initialAccount.id }));
  invariant(account, "tron account still exists");

  const time = useTimer(60);
  const isLoading = useTronPowerLoading(account);

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
    <Box horizontal alignItems="right">
      <Button ml={2} event="Freeze Flow Step 3 View OpD Clicked" onClick={onClose} secondary>
        <Trans i18nKey="freeze.steps.confirmation.success.later" />
      </Button>
      {time > 0 && isLoading ? (
        <ToolTip content={<TooltipContent />}>
          <Button
            ml={2}
            isLoading={isLoading && time === 0}
            disabled={isLoading}
            primary
            onClick={openVote}
          >
            <Trans i18nKey="freeze.steps.confirmation.success.votePending" values={{ time }} />
          </Button>
        </ToolTip>
      ) : (
        <Button ml={2} primary onClick={openVote}>
          <Trans i18nKey="freeze.steps.confirmation.success.vote" />
        </Button>
      )}
    </Box>
  );
}

export default withTheme(StepConfirmation);
