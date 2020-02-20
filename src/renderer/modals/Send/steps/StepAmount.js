// @flow

import React, { Fragment, PureComponent } from "react";
import { Trans } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";

import AccountFooter from "../AccountFooter";
import SendAmountFields from "../SendAmountFields";
import AmountField from "../fields/AmountField";
import type { StepProps } from "../types";

const StepAmount = ({
  t,
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  error,
  status,
  bridgePending,
}: StepProps) => {
  if (!status) return null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step Amount" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {account && transaction && mainAccount && (
        <Fragment key={account.id}>
          <AmountField
            status={status}
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridgePending={bridgePending}
            t={t}
          />
          <SendAmountFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </Fragment>
      )}
    </Box>
  );
};

export class StepAmountFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props;
    transitionTo("summary");
  };

  render() {
    const { account, parentAccount, status, bridgePending } = this.props;
    const { errors } = status;
    if (!account) return null;

    const mainAccount = getMainAccount(account, parentAccount);
    const isTerminated = mainAccount.currency.terminated;
    const hasErrors = Object.keys(errors).length;
    const canNext = !bridgePending && !hasErrors && !isTerminated;

    return (
      <>
        <AccountFooter parentAccount={parentAccount} account={account} status={status} />
        <Button isLoading={bridgePending} primary disabled={!canNext} onClick={this.onNext}>
          <Trans i18nKey="common.continue" />
        </Button>
      </>
    );
  }
}

export default StepAmount;
