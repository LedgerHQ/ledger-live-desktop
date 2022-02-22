// @flow
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { StepProps } from "../types";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import AmountField from "../fields/AmountField";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import Label from "~/renderer/components/Label";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  status,
  error,
}: StepProps) {
  //invariant(account && transaction && transaction.validators, "account and transaction required");

  const bridge = getAccountBridge(account);

  const { t } = useTranslation();

  const onChangeAmount = useCallback((amount: BigNumber) => {
    //updateValidator({ amount });
  }, []);

  return (
    <Box flow={1}>
      <TrackPage category="Delegation Withdraw Flow Solana" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <Label>{t("send.steps.details.amount")}</Label>
      <AmountField transaction={transaction} account={account} status={status} />
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
