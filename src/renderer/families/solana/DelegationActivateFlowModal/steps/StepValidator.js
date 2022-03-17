// @flow
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ValidatorsField from "../../shared/fields/ValidatorsField";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

import type { AccountBridge } from "@ledgerhq/live-common/lib/types";
import type {
  SolanaValidatorWithMeta,
  Transaction,
} from "@ledgerhq/live-common/lib/families/solana/types";
import ErrorDisplay from "../../shared/components/ErrorDisplay";

export default function StepValidator({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  error,
  t,
}: StepProps) {
  invariant(
    account && account.solanaResources && transaction,
    "solana account, resources and transaction required",
  );
  const { solanaResources } = account;

  const updateValidator = ({ address }: { address: string }) => {
    const bridge: AccountBridge<Transaction> = getAccountBridge(account, parentAccount);
    onUpdateTransaction(tx => {
      return bridge.updateTransaction(tx, {
        model: {
          ...tx.model,
          uiState: {
            ...tx.model.uiState,
            voteAccAddr: address,
          },
        },
      });
    });
  };

  const chosenVoteAccAddr = transaction.model.uiState.voteAccAddr;

  return (
    <Box flow={1}>
      <TrackPage category="Delegation Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      {status.errors.fee && <ErrorDisplay error={status.errors.fee} />}
      <ValidatorsField
        account={account}
        chosenVoteAccAddr={chosenVoteAccAddr}
        onChangeValidator={updateValidator}
        status={status}
        t={t}
      />
    </Box>
  );
}

export function StepValidatorFooter({
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
  const hasErrors = Object.keys(errors).length > 0;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="delegate-continue-button"
          disabled={!canNext}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}