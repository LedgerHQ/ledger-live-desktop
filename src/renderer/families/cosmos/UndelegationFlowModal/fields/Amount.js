// @flow
import React, { useMemo } from "react";
import type { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Label from "~/renderer/components/Label";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import * as invariant from "invariant";

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: (amount: BigNumber) => void,
};

export default function AmountField({
  account,
  transaction,
  onChange,
  status: { errors, warnings },
}: Props) {
  const { t } = useTranslation();
  const unit = getAccountUnit(account);

  invariant(transaction.validators, "cosmos: validators is required");
  const newValidator = transaction.validators[0];

  const validator = useMemo(
    () =>
      account.cosmosResources?.delegations.find(d => d.validatorAddress === newValidator.address),
    [account.cosmosResources, newValidator.address],
  );
  invariant(validator, "cosmos: validator is required");

  const amount = validator.amount;
  const newAmount = newValidator.amount;

  const options = useMemo(
    () => [
      {
        label: "25%",
        value: amount.multipliedBy(0.25),
      },
      {
        label: "50%",
        value: amount.multipliedBy(0.5),
      },
      {
        label: "75%",
        value: amount.multipliedBy(0.75),
      },
      {
        label: "100%",
        value: amount,
      },
    ],
    [amount],
  );

  const error = useMemo(() => Object.values(errors || {})[0], [errors]);
  const warning = useMemo(() => Object.values(warnings || {})[0], [warnings]);

  return (
    <Box mt={5}>
      <Label>{t("cosmos.undelegation.flow.steps.amount.fields.amount")}</Label>
      <InputCurrency
        autoFocus={false}
        error={error}
        warning={warning}
        containerProps={{ grow: true }}
        unit={unit}
        value={newAmount}
        onChange={onChange}
        renderLeft={<InputLeft>{unit.code}</InputLeft>}
        renderRight={
          <InputRight>
            {options.map(({ label, value }) => (
              <AmountButton
                active={value.eq(newAmount)}
                key={label}
                error={!!errors.amount}
                onClick={() => onChange(value)}
              >
                {label}
              </AmountButton>
            ))}
          </InputRight>
        }
      />
    </Box>
  );
}

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
    p.active
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
