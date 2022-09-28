// @flow
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Transaction } from "@ledgerhq/live-common/lib/families/solana/types";
import type { AccountBridge } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import LedgerByFigmentTC from "../../shared/components/LedgerByFigmentTCLink";
import ValidatorsField from "../../shared/fields/ValidatorsField";
import type { StepProps } from "../types";

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
      <TrackPage category="Solana Delegation" name="Step Validator" />
      {error && <ErrorBanner error={error} />}
      {status.errors.fee && <ErrorDisplay error={status.errors.fee} />}
      {status ? (
        <ValidatorsField
          account={account}
          chosenVoteAccAddr={chosenVoteAccAddr}
          onChangeValidator={updateValidator}
          status={status}
          t={t}
        />
      ) : null}
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
      <LedgerByFigmentTC transaction={transaction} />
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
