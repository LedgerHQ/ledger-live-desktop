// @flow
import { BigNumber } from "bignumber.js";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import {
  useCalculate,
  useCountervaluesPolling,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";
import ToolTip from "./Tooltip";
import { Trans } from "react-i18next";
import useTheme from "~/renderer/hooks/useTheme";
import { addExtraSessionTrackingPair, useTrackingPairs } from "../actions/general";

type Props = {
  // wich market to query
  currency: Currency,

  // when? if not given: take latest
  date?: Date,

  value: BigNumber | number,

  alwaysShowSign?: boolean,
  alwaysShowValue?: boolean, // overrides discreet mode

  subMagnitude?: number,

  placeholder?: React$Node,

  prefix?: React$Node,
  suffix?: React$Node,
  placeholderStyle?: { [key: string]: string | number },
};

export const NoCountervaluePlaceholder = ({
  placeholder,
  style = {},
}: {
  placeholder?: React$Node,
  style?: *,
}) => {
  const colors = useTheme("colors");

  return (
    <div style={{ ...style, maxHeight: "16px" }}>
      <ToolTip
        content={<Trans i18nKey="errors.countervaluesUnavailable.title" />}
        containerStyle={{ color: colors.palette.text.shade40 }}
      >
        {placeholder || "-"}
      </ToolTip>
    </div>
  );
};

export default function CounterValue({
  value: valueProp,
  date,
  currency,
  alwaysShowSign = false,
  alwaysShowValue = false,
  placeholder,
  prefix,
  suffix,
  placeholderStyle,
  ...props
}: Props) {
  const value = valueProp instanceof BigNumber ? valueProp.toNumber() : valueProp;
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const trackingPairs = useTrackingPairs();
  const cvPolling = useCountervaluesPolling();
  const hasTrackingPair = useMemo(
    () => trackingPairs.some(tp => tp.from === currency && tp.to === counterValueCurrency),
    [counterValueCurrency, currency, trackingPairs],
  );

  useEffect(() => {
    let t;
    if (!hasTrackingPair) {
      addExtraSessionTrackingPair({ from: currency, to: counterValueCurrency });
      t = setTimeout(cvPolling.poll, 2000); // poll after 2s to ensure debounced CV userSettings are effective after this update
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [counterValueCurrency, currency, cvPolling, cvPolling.poll, hasTrackingPair, trackingPairs]);

  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value,
    disableRounding: true,
    date,
  });

  if (typeof countervalue !== "number") {
    return <NoCountervaluePlaceholder placeholder={placeholder} style={placeholderStyle} />;
  }

  return (
    <>
      {prefix || null}
      <FormattedVal
        {...props}
        val={countervalue}
        currency={currency}
        unit={counterValueCurrency.units[0]}
        showCode
        alwaysShowSign={alwaysShowSign}
        alwaysShowValue={alwaysShowValue}
      />
      {suffix || null}
    </>
  );
}
