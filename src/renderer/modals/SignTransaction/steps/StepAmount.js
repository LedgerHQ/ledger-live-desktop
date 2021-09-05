// @flow

import React, { Fragment, PureComponent } from "react";
import { Trans } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import BuyButton from "~/renderer/components/BuyButton";
import { NotEnoughGas } from "@ledgerhq/errors";

import Alert from "~/renderer/components/Alert";
import TranslatedError from "~/renderer/components//TranslatedError";
import AccountFooter from "../AccountFooter";
import SendAmountFields from "../SendAmountFields";
import type { StepProps } from "../types";

const StepAmount = ({
  t,
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  error,
  warning,
  status,
  bridgePending,
  updateTransaction,
}: StepProps) => {
  if (!status) return null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  return (
    <Box flow={4}>
      <TrackPage category="Sign Transaction Flow" name="Step Amount" />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error || warning ? (
        <Alert type={error ? "error" : "warning"}>
          <TranslatedError error={error || warning} />
        </Alert>
      ) : null}
      {account && transaction && mainAccount && (
        <Fragment key={account.id}>
          <SendAmountFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
            bridgePending={bridgePending}
            updateTransaction={updateTransaction}
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
    const { gasPrice } = errors;
    return (
      <>
        <AccountFooter parentAccount={parentAccount} account={account} status={status} />
        {gasPrice && gasPrice instanceof NotEnoughGas ? (
          <BuyButton currency={mainAccount.currency} account={mainAccount} />
        ) : null}
        <Button
          id={"sign-transaction-amount-continue-button"}
          isLoading={bridgePending}
          primary
          disabled={!canNext}
          onClick={this.onNext}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </>
    );
  }
}

export default StepAmount;
