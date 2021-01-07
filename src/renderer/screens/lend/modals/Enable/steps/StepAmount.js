// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { localeSelector } from "~/renderer/reducers/settings";
import { useSpoilerForTransaction } from "~/renderer/hooks/useSpoilerForTransaction";
import type { StepProps } from "../types";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import BadgeLabel from "~/renderer/components/BadgeLabel";
import Text from "~/renderer/components/Text";
import Spoiler from "~/renderer/components/Spoiler";
import Label from "~/renderer/components/Label";
import InputCurrency from "~/renderer/components/InputCurrency";
import Switch from "~/renderer/components/Switch";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import ToolTip from "~/renderer/components/Tooltip";
import InfoCircle from "~/renderer/icons/InfoCircle";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

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
  bridgeError,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");
  const { amount, useAllAmount } = transaction;
  const locale = useSelector(localeSelector);

  const name = account?.name || parentAccount?.name;
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);

  const formattedAmount =
    amount &&
    formatCurrencyUnit(unit, amount, {
      locale,
      showAllDigits: false,
      disableRounding: false,
      showCode: true,
    });

  const bridge = getAccountBridge(account, parentAccount);

  const onChangeAmount = useCallback(
    (amount?: BigNumber) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          amount,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  const updateNoLimit = useCallback(
    (useAllAmount: boolean) =>
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          amount: BigNumber(0),
          useAllAmount,
        }),
      ),
    [bridge, transaction, onChangeTransaction],
  );

  const [spoilerOpened, setSpoilerOpened] = useSpoilerForTransaction(status);

  return (
    <Box flow={1}>
      <TrackPage
        category="Lend"
        name="Approve Step 1"
        eventProperties={{ currencyName: currency.name }}
      />
      {bridgeError ? <ErrorBanner error={bridgeError} /> : null}
      <Box vertical>
        <Box px={4} mt={4} mb={4}>
          <Text ff="Inter|Medium" fontSize={4} flex={1}>
            <Trans
              i18nKey="lend.enable.steps.amount.summary"
              values={{
                contractName: t("lend.enable.steps.amount.contractName", {
                  currencyName: currency.ticker,
                }),
                accountName: name,
                amount:
                  amount && amount.gt(0)
                    ? t("lend.enable.steps.amount.limit", { amount: formattedAmount })
                    : t("lend.enable.steps.amount.noLimit", { assetName: currency.name }),
              }}
            >
              <BadgeLabel
                uppercase={false}
                innerStyle={{ display: "inline-flex", padding: "5px 10px" }}
              />
            </Trans>
          </Text>
        </Box>
        <Spoiler
          opened={spoilerOpened}
          onOpen={setSpoilerOpened}
          textTransform
          title={<Trans i18nKey="lend.enable.steps.amount.advanced" />}
        >
          <Box vertical alignItems="stretch">
            <Box my={4}>
              <Box horizontal justifyContent="space-between" mb={2}>
                <ToolTip content={<Trans i18nKey="lend.enable.steps.amount.amountLabelTooltip" />}>
                  <Label>
                    <Trans i18nKey="lend.enable.steps.amount.amountLabel" />
                    &nbsp;
                    <InfoCircle size={14} />
                  </Label>
                </ToolTip>

                <Switch isChecked={!!useAllAmount} onChange={updateNoLimit} />
              </Box>
              <InputCurrency
                disabled={!!useAllAmount}
                autoFocus={false}
                error={status.errors.amount}
                containerProps={{ grow: true }}
                unit={unit}
                value={amount}
                onChange={onChangeAmount}
                placeholder={useAllAmount ? "No limit" : null}
                renderRight={<InputRight>{unit.code}</InputRight>}
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
            <Box my={2}>
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
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </>
  );
}
