// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import Spoiler from "~/renderer/components/Spoiler";
import Label from "~/renderer/components/Label";
import InputCurrency from "~/renderer/components/InputCurrency";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import AmountField from "../fields/AmountField";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  alignItems: "center",
  horizontal: true,
}))`
  padding: ${p => p.theme.space[2]}px;
`;

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
  const { amount } = transaction;

  const unit = getAccountUnit(account);

  const bridge = getAccountBridge(account, parentAccount);

  const onChangeAmount = useCallback(
    (amount?: BigNumber) =>
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          amount,
        }),
      ),
    [bridge, transaction, onChangeTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Lending Withdraw Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box vertical>
        <Box my={4}>
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
        <Box my={2}>
          <GasPriceField
            account={parentAccount}
            transaction={transaction}
            onChange={onChangeTransaction}
            status={status}
          />
        </Box>
        <Spoiler textTransform title={<Trans i18nKey="lend.withdraw.steps.amount.advanced" />}>
          <Box vertical alignItems="stretch">
            <Box mt={2}>
              <GasLimitField
                account={parentAccount}
                transaction={transaction}
                onChange={onChangeTransaction}
                status={status}
              />
            </Box>
          </Box>
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
    <Box horizontal>
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
