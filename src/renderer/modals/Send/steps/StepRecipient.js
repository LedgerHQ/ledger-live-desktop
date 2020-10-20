// @flow

import React, { PureComponent } from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Label from "~/renderer/components/Label";
import SelectAccount from "~/renderer/components/SelectAccount";

import SendRecipientFields, { getFields } from "../SendRecipientFields";
import RecipientField from "../fields/RecipientField";

import type { StepProps } from "../types";

import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";

const StepRecipient = ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
  bridgePending,
  maybeRecipient,
  onResetMaybeRecipient,
}: StepProps) => {
  if (!status) return null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step Recipient" />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t("send.steps.details.selectAccountDebit")}</Label>
        <SelectAccount
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>
      <StepRecipientSeparator />
      {account && transaction && mainAccount && (
        <>
          <RecipientField
            status={status}
            autoFocus={openedFromAccount}
            account={mainAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridgePending={bridgePending}
            t={t}
            initValue={maybeRecipient}
            resetInitValue={onResetMaybeRecipient}
          />
          <SendRecipientFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </>
      )}
    </Box>
  );
};

export class StepRecipientFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props;
    transitionTo("amount");
  };

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props;
    const { errors } = status;

    const mainAccount = account ? getMainAccount(account, parentAccount) : null;

    const isTerminated = mainAccount && mainAccount.currency.terminated;
    const fields = ["recipient"].concat(mainAccount ? getFields(mainAccount) : []);
    const hasFieldError = Object.keys(errors).some(name => fields.includes(name));
    const canNext = !bridgePending && !hasFieldError && !isTerminated;

    return (
      <>
        <Button
          id={"send-recipient-continue-button"}
          isLoading={bridgePending}
          primary
          disabled={!canNext}
          onClick={this.onNext}
        >
          {t("common.continue")}
        </Button>
      </>
    );
  }
}

export default StepRecipient;
