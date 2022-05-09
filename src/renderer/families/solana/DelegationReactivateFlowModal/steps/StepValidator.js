// @flow
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import {
  useSolanaStakesWithMeta,
  useValidators,
} from "@ledgerhq/live-common/lib/families/solana/react";
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import type { StepProps } from "../types";
import ValidatorRow from "../../shared/components/ValidatorRow";

export default function StepValidator({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  error,
  t,
}: StepProps) {
  if (account === null || transaction === null || account?.solanaResources === undefined) {
    throw new Error("account, transaction and solana resouces required");
  }

  const { solanaResources } = account;

  if (transaction?.model.kind !== "stake.delegate") {
    throw new Error("unsupported transaction");
  }

  const { stakeAccAddr } = transaction.model.uiState;

  const stakesWithMeta = useSolanaStakesWithMeta(account.currency, solanaResources.stakes);

  const stakeWithMeta = stakesWithMeta.find(s => s.stake.stakeAccAddr === stakeAccAddr);

  if (stakeWithMeta === undefined) {
    throw new Error(`stake with account address <${stakeAccAddr}> not found`);
  }

  const { stake } = stakeWithMeta;

  const unit = getAccountUnit(account);

  const validators = useValidators(account.currency);
  const validator = validators.find(v => v.voteAccount === stake.delegation?.voteAccAddr);

  if (validator === undefined) {
    return null;
  }

  return (
    <Box flow={1}>
      <TrackPage category="Solana Delegation Reactivate" name="Step Validator" />
      {error && <ErrorBanner error={error} />}
      <ValidatorRow
        disableHover
        active
        currency={account.currency}
        key={validator.voteAccount}
        validator={validator}
        unit={unit}
      ></ValidatorRow>
      {status.errors.fee && <ErrorDisplay error={status.errors.fee} />}
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
