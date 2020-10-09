// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import { useSelector } from "react-redux";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";

type Props = {
  // wich market to query
  currency: Currency,

  // when? if not given: take latest
  date?: Date,

  value: BigNumber,

  alwaysShowSign?: boolean,

  subMagnitude?: number,

  placeholder?: React$Node,

  prefix?: React$Node,
  suffix?: React$Node,
};

export default function CounterValue({
  value,
  date,
  currency,
  alwaysShowSign = false,
  placeholder,
  prefix,
  suffix,
  ...props
}: Props) {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value: value.toNumber(),
    disableRounding: true,
  });

  if (typeof countervalue === "undefined") {
    return placeholder || null;
  }

  return (
    <>
      {prefix || null}
      <FormattedVal
        {...props}
        val={BigNumber(countervalue)}
        currency={currency}
        unit={counterValueCurrency.units[0]}
        showCode
        alwaysShowSign={alwaysShowSign}
      />
      {suffix || null}
    </>
  );
}
