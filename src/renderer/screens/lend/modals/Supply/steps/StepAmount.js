// @flow

import invariant from "invariant";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InputCurrency from "~/renderer/components/InputCurrency";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Select from "~/renderer/components/Select";
import Label from "~/renderer/components/Label";
import Spoiler from "~/renderer/components/Spoiler";
import FormattedVal from "~/renderer/components/FormattedVal";
import useMaxSpendable from "~/renderer/hooks/useMaxSpendable";
import GasPriceField from "~/renderer/families/ethereum/GasPriceField";
import GasLimitField from "~/renderer/families/ethereum/GasLimitField";
import { renderValue, renderOption, getOptionValue } from "../../SelectAccountStep";

import type { StepProps } from "../types";

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

export default function StepAmount({
  amount,
  onChange,
  onChangeAccount,
  account,
  accounts,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");
  const [focused, setFocused] = useState(false);
  const unit = getAccountUnit(account);
  const { warnings } = status;
  const maxSpendable = useMaxSpendable({ account, parentAccount, transaction });

  const warning = useMemo(() => focused && Object.values(warnings || {})[0], [focused, warnings]);

  const options = useMemo(
    () => [
      {
        label: "25%",
        value: BigNumber(0),
      },
      {
        label: "50%",
        value: BigNumber(0),
      },
      {
        label: "75%",
        value: BigNumber(0),
      },
      {
        label: "100%",
        value: BigNumber(0),
      },
    ],
    [],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Lending Supply Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t("lend.supply.steps.amount.selectedAccount")}</Label>
        <Select
          value={account}
          options={accounts}
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
          {maxSpendable ? (
            <Box horizontal>
              <Label style={{ paddingLeft: 8 }}>{t("lend.supply.steps.amount.available")}</Label>
              <Label style={{ paddingLeft: 4 }}>~</Label>
              <Label style={{ paddingLeft: 2 }}>
                <FormattedVal
                  style={{ width: "auto" }}
                  color="palette.text.shade100"
                  val={maxSpendable}
                  unit={unit}
                  showCode
                />
              </Label>
            </Box>
          ) : null}
        </Box>
        <InputCurrency
          autoFocus={false}
          // error={error}
          // warning={warning}
          containerProps={{ grow: true }}
          unit={unit}
          value={amount}
          onChange={onChange}
          onChangeFocus={() => setFocused(true)}
          renderLeft={<InputLeft>{unit.code}</InputLeft>}
          renderRight={
            <InputRight>
              {options.map(({ label, value }) => (
                <AmountButton
                  active={value.eq(amount)}
                  key={label}
                  error={undefined}
                  onClick={() => onChange(value)}
                >
                  {label}
                </AmountButton>
              ))}
            </InputRight>
          }
        />
      </Box>
      <Box mt={5}>
        <Spoiler textTransform title={t("account.settings.advancedLogs")}>
          {parentAccount && transaction ? (
            <>
              <GasPriceField
                onChange={() => {}}
                account={parentAccount}
                transaction={transaction}
                status={status}
              />
              <GasLimitField
                onChange={() => {}}
                account={parentAccount}
                transaction={transaction}
                status={status}
              />
            </>
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
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
