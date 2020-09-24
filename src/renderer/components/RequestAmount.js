// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import { useCalculate, useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { calculate } from "@ledgerhq/live-common/lib/countervalues/logic";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import IconTransfer from "~/renderer/icons/Transfer";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

type Props = {
  autoFocus?: boolean,
  // left value (always the one which is returned)
  value: BigNumber,

  disabled?: boolean,

  validTransactionError?: ?Error,
  validTransactionWarning?: ?Error,

  // max left value
  max?: BigNumber,

  // change handler
  onChange: BigNumber => void,

  // used to determine the left input unit
  account: AccountLike,
};

export default function RequestAmount({
  max = BigNumber(Infinity),
  onChange,
  autoFocus,
  disabled,
  value,
  account,
  validTransactionError,
  validTransactionWarning,
}: Props) {
  // used to determine the right input unit
  // retrieved via selector (take the chosen countervalue unit)
  const rightCurrency = useSelector(counterValueCurrencySelector);
  const currency = getAccountCurrency(account);
  // used to calculate the opposite field value (right & left)
  const rightCountervalue = useCalculate({
    from: currency,
    to: rightCurrency,
    value: value.toNumber(),
    disableRounding: true,
  });
  const right = BigNumber(rightCountervalue ?? 0);
  const rightUnit = rightCurrency.units[0];
  const defaultUnit = getAccountUnit(account);
  const state = useCountervaluesState();

  const handleChangeAmount = useCallback(
    (changedField: string) => (val: BigNumber) => {
      if (changedField === "left") {
        onChange(val.gt(max) ? max : val);
      } else if (changedField === "right") {
        const leftVal = BigNumber(
          calculate(state, {
            from: currency,
            to: rightCurrency,
            value: val.toNumber(),
            reverse: true,
          }) ?? 0,
        );
        console.log("!!!", leftVal.toNumber());
        onChange(leftVal.gt(max) ? max : leftVal);
      }
    },
    [onChange, max, currency, rightCurrency, state],
  );

  const onLeftChange = handleChangeAmount("left");
  const onRightChange = handleChangeAmount("right");

  return (
    <Box horizontal flow={5} alignItems="center">
      <Box horizontal grow shrink>
        <InputCurrency
          autoFocus={autoFocus}
          disabled={disabled}
          error={validTransactionError}
          warning={validTransactionWarning}
          containerProps={{ grow: true }}
          defaultUnit={defaultUnit}
          value={value}
          onChange={onLeftChange}
          renderRight={<InputRight>{defaultUnit.code}</InputRight>}
        />
        <InputCenter>
          <IconTransfer />
        </InputCenter>
        <InputCurrency
          disabled={disabled}
          containerProps={{ grow: true }}
          defaultUnit={rightUnit}
          value={right}
          onChange={onRightChange}
          renderRight={<InputRight>{rightUnit.code}</InputRight>}
          showAllDigits
          subMagnitude={3}
        />
      </Box>
    </Box>
  );
}

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const InputCenter = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
  color: "palette.text.shade40",
}))`
  margin-left: 19px;
  margin-right: 19px;
`;
