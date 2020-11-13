// @flow

import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import { delegatableAccountsSelector } from "~/renderer/actions/general";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Label from "~/renderer/components/Label";
import { SelectAccount } from "~/renderer/components/SelectAccount";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

import type { StepProps } from "../types";

const StepAccount = ({
  account,
  parentAccount,
  openedFromAccount,
  onChangeAccount,
  error,
  status,
  eventType,
}: StepProps) => {
  const { t } = useTranslation();
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const accounts = useSelector(delegatableAccountsSelector);

  if (!status) return null;
  return (
    <Box flow={4}>
      <TrackPage
        category={`Delegation Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step Account"
      />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t("delegation.flow.steps.account.toDelegate")}</Label>
        <SelectAccount
          accounts={accounts}
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>
    </Box>
  );
};

export const StepAccountFooter = ({
  account,
  parentAccount,
  bridgePending,
  transitionTo,
}: StepProps) => {
  const { t } = useTranslation();
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const isTerminated = mainAccount && mainAccount.currency.terminated;
  const canNext = !bridgePending && !isTerminated;

  const onNext = useCallback(() => transitionTo("summary"), [transitionTo]);

  return (
    <>
      <Button
        id={"delegate-account-continue-button"}
        isLoading={bridgePending}
        primary
        disabled={!canNext}
        onClick={onNext}
      >
        {t("common.continue")}
      </Button>
    </>
  );
};

export default StepAccount;
