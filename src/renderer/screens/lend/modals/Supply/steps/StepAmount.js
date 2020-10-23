// @flow

import invariant from "invariant";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import styled from "styled-components";

import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InputCurrency from "~/renderer/components/InputCurrency";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Select from "~/renderer/components/Select";
import Label from "~/renderer/components/Label";
import Spoiler from "~/renderer/components/Spoiler";
import FormattedVal from "~/renderer/components/FormattedVal";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import { renderValue, renderOption, getOptionValue } from "../../SelectAccountStep";
import { subAccountByCurrencyOrderedSelector } from "~/renderer/reducers/accounts";

import type { StepProps } from "../types";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

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

function StepAmount({
  account,
  parentAccount,
  onChangeAccount,
  onChangeTransaction,
  onUpdateTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
  collection,
}: StepProps & { collection: Array<{ account: TokenAccount, parentAccount: ?Account }> }) {
  invariant(account && transaction, "account and transaction required");
  const [focused, setFocused] = useState(false);
  const bridge = getAccountBridge(account, parentAccount);
  const unit = getAccountUnit(account);
  const { warnings } = status;
  const { amount } = transaction;

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

  const warning = useMemo(() => focused && Object.values(warnings || {})[0], [focused, warnings]);

  const options = useMemo(
    () => [
      {
        label: "25%",
        value: account.spendableBalance.multipliedBy(0.25),
      },
      {
        label: "50%",
        value: account.spendableBalance.multipliedBy(0.5),
      },
      {
        label: "75%",
        value: account.spendableBalance.multipliedBy(0.75),
      },
      {
        label: "100%",
        value: account.spendableBalance,
      },
    ],
    [account.spendableBalance],
  );

  return (
    <Box flow={2}>
      <TrackPage category="Lending Supply Flow" name="Step Amount" />
      <Box mt={4} flow={1}>
        <Label>{t("lend.supply.steps.amount.selectedAccount")}</Label>
        <Select
          value={{ account, parentAccount }}
          options={collection}
          getOptionValue={getOptionValue}
          renderValue={renderValue}
          renderOption={renderOption}
          filterOption={false}
          isSearchable={false}
          placeholder={t("common.selectAccount")}
          noOptionsMessage={({ inputValue }) =>
            t("common.selectAccountNoOption", { accountName: inputValue })
          }
          onChange={onChangeAccount}
        />
      </Box>
      <Box vertical mt={5}>
        <Box horizontal style={{ justifyContent: "space-between" }}>
          <Label>{t("lend.supply.steps.amount.amountToSupply")}</Label>
          {account.spendableBalance.gt(0) ? (
            <Box horizontal>
              <Label style={{ paddingLeft: 8 }}>{t("lend.supply.steps.amount.available")}</Label>
              <Label style={{ paddingLeft: 4 }}>~</Label>
              <Label style={{ paddingLeft: 2 }}>
                <FormattedVal
                  style={{ width: "auto" }}
                  color="palette.text.shade100"
                  val={account.spendableBalance}
                  unit={unit}
                  showCode
                />
              </Label>
            </Box>
          ) : null}
        </Box>
        <InputCurrency
          autoFocus={false}
          error={error}
          warning={warning}
          containerProps={{ grow: true }}
          unit={unit}
          value={amount}
          onChange={onChangeAmount}
          onChangeFocus={() => setFocused(true)}
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
        <Spoiler textTransform title={t("account.settings.advancedLogs")}>
          {parentAccount && transaction ? (
            <Box my={4}>
              <GasPriceField
                // $FlowFixMe B*tch
                onChange={onChangeTransaction}
                account={parentAccount}
                transaction={transaction}
                status={status}
                displayError={false}
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
  // const { errors } = status;
  // const hasErrors = Object.keys(errors).length;
  // const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
