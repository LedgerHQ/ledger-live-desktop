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
  // crypto value (always the one which is returned)
  value: BigNumber,
  disabled?: boolean,
  validTransactionError?: ?Error,
  validTransactionWarning?: ?Error,
  // change handler
  onChange: BigNumber => void,
  // used to determine the crypto input unit
  account: AccountLike,
};

export default function RequestAmount({
  onChange,
  autoFocus,
  disabled,
  value,
  account,
  validTransactionError,
  validTransactionWarning,
}: Props) {
  const fiatCurrency = useSelector(counterValueCurrencySelector);
  const cryptoCurrency = getAccountCurrency(account);
  const fiatCountervalue = useCalculate({
    from: cryptoCurrency,
    to: fiatCurrency,
    value: value.toNumber(),
    disableRounding: true,
  });
  const fiatVal = BigNumber(fiatCountervalue ?? 0);
  const fiatUnit = fiatCurrency.units[0];
  const cryptoUnit = getAccountUnit(account);
  const state = useCountervaluesState();

  const onChangeFiatAmount = useCallback(
    val => {
      const cryptoVal = BigNumber(
        calculate(state, {
          from: cryptoCurrency,
          to: fiatCurrency,
          value: val.toNumber(),
          reverse: true,
        }) ?? 0,
      );
      onChange(cryptoVal);
    },
    [onChange, state, cryptoCurrency, fiatCurrency],
  );

  return (
    <Box horizontal flow={5} alignItems="center">
      <Box horizontal grow shrink>
        <InputCurrency
          autoFocus={autoFocus}
          disabled={disabled}
          error={validTransactionError}
          warning={validTransactionWarning}
          containerProps={{ grow: true }}
          defaultUnit={cryptoUnit}
          value={value}
          onChange={onChange}
          renderRight={<InputRight>{cryptoUnit.code}</InputRight>}
        />
        <InputCenter>
          <IconTransfer />
        </InputCenter>
        <InputCurrency
          disabled={disabled}
          containerProps={{ grow: true }}
          defaultUnit={fiatUnit}
          value={fiatVal}
          onChange={onChangeFiatAmount}
          renderRight={<InputRight>{fiatUnit.code}</InputRight>}
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
