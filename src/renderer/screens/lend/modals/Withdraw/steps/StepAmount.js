// @flow
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { StepProps } from "../types";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import Spoiler from "~/renderer/components/Spoiler";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import AmountField from "../fields/AmountField";
import WithdrawableBanner from "../../../WithdrawableBanner";

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");

  const currency = getAccountCurrency(account);

  return (
    <Box flow={1}>
      <TrackPage
        category="Lend"
        name="Withdraw Step 1"
        eventProperties={{ currencyName: currency.name }}
      />
      <Box vertical>
        {account && transaction ? (
          <WithdrawableBanner account={account} parentAccount={parentAccount} />
        ) : null}
        <Box mt={4} my={4}>
          <AmountField
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            status={status}
            bridgePending={bridgePending}
            t={t}
          />
        </Box>
        <Spoiler textTransform title={<Trans i18nKey="lend.withdraw.steps.amount.advanced" />}>
          {parentAccount && transaction ? (
            <Box my={4}>
              <GasPriceField
                // $FlowFixMe wen TypeScript
                onChange={onChangeTransaction}
                account={parentAccount}
                transaction={transaction}
                status={status}
              />
              <Box mt={3}>
                <GasLimitField
                  onChange={onChangeTransaction}
                  account={parentAccount}
                  transaction={transaction}
                  status={status}
                />
              </Box>
            </Box>
          ) : null}
        </Spoiler>
      </Box>
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
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </>
  );
}
