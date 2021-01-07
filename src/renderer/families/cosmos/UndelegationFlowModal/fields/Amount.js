// @flow
import React, { useMemo, useState, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Label from "~/renderer/components/Label";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  amount: BigNumber,
  validator: *,
  account: Account,
  status: TransactionStatus,
  onChange: (amount: BigNumber) => void,
  label: React$Node,
};

export default function AmountField({
  amount,
  validator,
  account,
  onChange,
  status: { errors, warnings },
  label,
}: Props) {
  const unit = getAccountUnit(account);

  const [currentValidator, setCurrentValidator] = useState(validator);
  const [focused, setFocused] = useState(false);
  const [initialAmount, setInitialAmount] = useState(validator ? validator.amount : BigNumber(0));

  useEffect(() => {
    if (validator && validator.validatorAddress !== currentValidator.validatorAddress) {
      setCurrentValidator(validator);
      setInitialAmount(validator.amount);
    }
  }, [validator, currentValidator]);

  const options = useMemo(
    () => [
      {
        label: "25%",
        value: initialAmount.multipliedBy(0.25).integerValue(),
      },
      {
        label: "50%",
        value: initialAmount.multipliedBy(0.5).integerValue(),
      },
      {
        label: "75%",
        value: initialAmount.multipliedBy(0.75).integerValue(),
      },
      {
        label: "100%",
        value: initialAmount,
      },
    ],
    [initialAmount],
  );

  const error = errors.amount || errors.redelegation || errors.unbonding;

  const warning = useMemo(() => focused && Object.values(warnings || {})[0], [focused, warnings]);

  return (
    <Box my={2}>
      <Label>{label}</Label>
      <InputCurrency
        autoFocus={false}
        error={error}
        warning={warning}
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
                error={!!error}
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
