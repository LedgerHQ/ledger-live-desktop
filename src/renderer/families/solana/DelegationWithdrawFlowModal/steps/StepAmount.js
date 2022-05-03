// @flow
import invariant from "invariant";
import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Label from "~/renderer/components/Label";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import AmountField from "../fields/AmountField";
import type { StepProps } from "../types";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  status,
  error,
}: StepProps) {
  const { t } = useTranslation();

  return (
    <Box flow={1}>
      <TrackPage category="Solana Delegation Withdraw" name="Step Amount" />
      {error && <ErrorBanner error={error} />}
      <Label>{t("send.steps.details.amount")}</Label>
      <AmountField transaction={transaction} account={account} status={status} />
      {status.errors.fee && <ErrorDisplay error={status.errors.fee} />}
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  invariant(account, "account required");

  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          {t("common.continue")}
        </Button>
      </Box>
    </>
  );
}
