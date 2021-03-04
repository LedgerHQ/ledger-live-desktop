// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ValidatorsField from "../fields/ValidatorsField";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

export default function StepNomination({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  error,
  openModal,
  onClose,
  t,
}: StepProps) {
  invariant(account && transaction && transaction.validators, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const { polkadotResources } = account;

  invariant(polkadotResources, "polkadotResources required");

  const nominations = polkadotResources.nominations || [];

  const onGoToChill = useCallback(() => {
    onClose();

    openModal("MODAL_POLKADOT_SIMPLE_OPERATION", {
      account,
      mode: "chill",
    });
  }, [onClose, openModal, account]);

  const updateNomination = useCallback(
    updater => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          validators: updater(transaction.validators || []),
        }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Nomination Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <ValidatorsField
        account={account}
        validators={transaction.validators || []}
        nominations={nominations}
        bridgePending={bridgePending}
        onChangeNominations={updateNomination}
        status={status}
        t={t}
        onGoToChill={onGoToChill}
      />
    </Box>
  );
}

export function StepNominationFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="nominate-continue-button"
          disabled={!canNext}
          isLoading={bridgePending}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
