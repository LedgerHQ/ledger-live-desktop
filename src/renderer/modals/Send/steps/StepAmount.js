// @flow

import React, { Fragment, PureComponent } from "react";
import { Trans } from "react-i18next";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import SpendableBanner from "~/renderer/components/SpendableBanner";
import BuyButton from "~/renderer/components/BuyButton";
import { NotEnoughGas } from "@ledgerhq/errors";
import Label from "~/renderer/components/Label";
import Input from "~/renderer/components/Input";
import { useSelector } from "react-redux";
import { getAllNFTs } from "~/renderer/reducers/accounts";

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
  onChangeQuantities,
  error,
  status,
  bridgePending,
  maybeAmount,
  onResetMaybeAmount,
  updateTransaction,
  currencyName,
  isNFTSend,
}: StepProps) => {
  const allNfts = useSelector(getAllNFTs);
  const nft = allNfts?.find(nft => nft.tokenId === transaction?.tokenIds?.[0]);
  if (!status) return null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  return (
    <Box flow={4}>
      <TrackPage
        category="Send Flow"
        name="Step Amount"
        currencyName={currencyName}
        isNFTSend={isNFTSend}
      />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {account && transaction && mainAccount && (
        <Fragment key={account.id}>
          {account && transaction && !isNFTSend ? (
            <SpendableBanner
              account={account}
              parentAccount={parentAccount}
              transaction={transaction}
            />
          ) : null}
          {isNFTSend && nft ? (
            nft.collection.standard === "ERC1155" ? (
              <Box mb={2}>
                <Label>{t("send.steps.amount.nftQuantity")}</Label>
                <Input
                  value={transaction?.quantities[0]}
                  onChange={onChangeQuantities}
                  error={status?.errors?.amount}
                />
              </Box>
            ) : null
          ) : (
            <AmountField
              status={status}
              account={account}
              parentAccount={parentAccount}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              bridgePending={bridgePending}
              t={t}
              initValue={maybeAmount}
              resetInitValue={onResetMaybeAmount}
            />
          )}
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
    const { account, parentAccount, status, bridgePending, isNFTSend } = this.props;
    const { errors } = status;
    if (!account) return null;

    const mainAccount = getMainAccount(account, parentAccount);
    const isTerminated = mainAccount.currency.terminated;
    const hasErrors = Object.keys(errors).length;
    const canNext = !bridgePending && !hasErrors && !isTerminated;
    const { gasPrice } = errors;

    return (
      <>
        {!isNFTSend ? (
          <AccountFooter parentAccount={parentAccount} account={account} status={status} />
        ) : null}
        {gasPrice instanceof NotEnoughGas ? (
          <BuyButton currency={mainAccount.currency} account={mainAccount} />
        ) : null}
        <Button
          id={"send-amount-continue-button"}
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
