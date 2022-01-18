// @flow

import invariant from "invariant";
import { useSelector } from "react-redux";
import React, { useCallback, useRef } from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { usePolkadotBondLoading } from "@ledgerhq/live-common/lib/families/polkadot/react";
import { isFirstBond } from "@ledgerhq/live-common/lib/families/polkadot/logic";

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
import { OperationDetails } from "~/renderer/drawers/OperationDetails";
import { setDrawer } from "~/renderer/drawers/Provider";

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
      <Trans i18nKey="polkadot.bond.steps.confirmation.tooltip.title" />
    </Text>
    <Text>
      <Trans i18nKey="polkadot.bond.steps.confirmation.tooltip.desc" />
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
  const wasFirstBond = useRef(account && isFirstBond(account));

  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Bond Flow" name="Step Confirmed" />
        <SuccessDisplay
          title={<Trans i18nKey="polkadot.bond.steps.confirmation.success.title" />}
          description={multiline(
            wasFirstBond.current
              ? t("polkadot.bond.steps.confirmation.success.textNominate")
              : t("polkadot.bond.steps.confirmation.success.text"),
          )}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Bond Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="polkadot.bond.steps.confirmation.broadcastError" />}
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
  optimisticOperation,
}: StepProps) {
  invariant(initialAccount && initialAccount.polkadotResources, "polkadot account required");
  const wasFirstBond = useRef(initialAccount && isFirstBond(initialAccount));
  const account = useSelector(s => accountSelector(s, { accountId: initialAccount.id }));
  invariant(account, "polkadot account still exists");

  const isLoading = usePolkadotBondLoading(account);

  const openNominate = useCallback(() => {
    onClose();
    if (account) {
      openModal("MODAL_POLKADOT_NOMINATE", {
        account: account,
      });
    }
  }, [account, onClose, openModal]);

  const goToOperationDetails = useCallback(() => {
    onClose();
    if (account && optimisticOperation) {
      setDrawer(OperationDetails, {
        operationId: optimisticOperation.id,
        accountId: account.id,
      });
    }
  }, [account, optimisticOperation, onClose]);

  if (error) {
    return <RetryButton ml={2} primary onClick={onRetry} />;
  }

  return wasFirstBond.current ? (
    <Box horizontal alignItems="right">
      <Button ml={2} onClick={onClose} secondary>
        <Trans i18nKey="polkadot.bond.steps.confirmation.success.later" />
      </Button>
      <ToolTip content={isLoading ? <TooltipContent /> : null}>
        <Button ml={2} isLoading={isLoading} disabled={isLoading} primary onClick={openNominate}>
          <Trans i18nKey="polkadot.bond.steps.confirmation.success.nominate" />
        </Button>
      </ToolTip>
    </Box>
  ) : (
    <Box horizontal alignItems="right">
      <Button data-test-id="modal-close-button" ml={2} onClick={onClose}>
        <Trans i18nKey="common.close" />
      </Button>
      {optimisticOperation ? (
        // FIXME make a standalone component!
        <Button
          primary
          ml={2}
          event="Bond Flow Step 3 View OpD Clicked"
          onClick={goToOperationDetails}
        >
          <Trans i18nKey="polkadot.unbond.steps.confirmation.success.cta" />
        </Button>
      ) : null}
    </Box>
  );
}

export default withTheme(StepConfirmation);
