// @flow

import invariant from "invariant";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useSpoilerForTransaction } from "~/renderer/hooks/useSpoilerForTransaction";
import { useSupplyMax, useSupplyMaxChoiceButtons } from "@ledgerhq/live-common/lib/compound/react";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InputCurrency from "~/renderer/components/InputCurrency";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Label from "~/renderer/components/Label";
import Spoiler from "~/renderer/components/Spoiler";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import { subAccountByCurrencyOrderedSelector } from "~/renderer/reducers/accounts";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import type { StepProps } from "../types";
import SupplyBanner from "../../../SupplyBanner";

const InputLeft = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
  pl: 3,
}))``;

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
}))`
  padding: ${p => p.theme.space[2]}px;
`;

const AmountButton: ThemedComponent<{ error: boolean, active: boolean }> = styled.button.attrs(
  () => ({
    type: "button",
  }),
)`
  background-color: ${p =>
    p.error
      ? p.theme.colors.lightRed
      : p.active
      ? p.theme.colors.palette.primary.main
      : p.theme.colors.palette.action.hover};
  color: ${p =>
    p.error
      ? p.theme.colors.alertRed
      : p.active
      ? p.theme.colors.palette.primary.contrastText
      : p.theme.colors.palette.primary.main}!important;
  border: none;
  border-radius: 4px;
  padding: 0px ${p => p.theme.space[2]}px;
  margin: 0 2.5px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease-out;
  &:hover {
    filter: contrast(2);
  }
`;

const spoilerHandlesError = key => key !== "amount";

function StepAmount({
  account,
  parentAccount,
  onChangeAccount,
  onChangeTransaction,
  onUpdateTransaction,
  transaction,
  status,
  bridgeError,
  bridgePending,
  t,
  collection,
}: StepProps & { collection: Array<{ account: TokenAccount, parentAccount: ?Account }> }) {
  invariant(account && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const { amount } = transaction;
  const supplyMax = useSupplyMax(account);
  const options = useSupplyMaxChoiceButtons(supplyMax);

  const onChangeAmount = useCallback(
    (a?: BigNumber) => {
      onUpdateTransaction(tx =>
        bridge.updateTransaction(tx, {
          amount: a,
        }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  const [spoiler, setSpoiler] = useSpoilerForTransaction(status, spoilerHandlesError);

  return (
    <Box flow={2}>
      <TrackPage
        category="Lend"
        name="Supply Step 1"
        eventProperties={{ currencyName: currency.name }}
      />
      {bridgeError ? <ErrorBanner error={bridgeError} /> : null}
      {account && account.type === "TokenAccount" && transaction ? (
        <SupplyBanner account={account} parentAccount={parentAccount} />
      ) : null}
      <Box vertical mt={4}>
        <Box>
          <Label>{t("lend.supply.steps.amount.amountToSupply")}</Label>
        </Box>
        <InputCurrency
          autoFocus={false}
          error={status.errors.amount}
          warning={status.warnings.amount}
          containerProps={{ grow: true }}
          unit={unit}
          value={amount}
          onChange={onChangeAmount}
          renderLeft={<InputLeft>{unit.code}</InputLeft>}
          renderRight={
            <InputRight>
              {options.map(({ label, value }) => (
                <AmountButton
                  active={value.eq(amount)}
                  key={label}
                  error={undefined}
                  onClick={() => onChangeAmount(value)}
                >
                  {label}
                </AmountButton>
              ))}
            </InputRight>
          }
        />
      </Box>
      <Box mt={6}>
        <Spoiler
          opened={spoiler}
          onOpen={setSpoiler}
          textTransform
          title={t("account.settings.advancedLogs")}
        >
          {parentAccount && transaction ? (
            <Box my={4}>
              <GasPriceField
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

const mapStateToProps = createStructuredSelector({
  collection: subAccountByCurrencyOrderedSelector,
});

const m: React$ComponentType<StepProps> = connect(mapStateToProps)(StepAmount);

export default m;

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
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
