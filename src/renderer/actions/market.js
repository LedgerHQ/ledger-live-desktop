// @flow

import { createAction } from "redux-actions";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";
import { useCalculateMany } from "@ledgerhq/live-common/lib/countervalues/react";
import { Currency } from "@ledgerhq/live-common/lib/types";

export const openPlatformAppDisclaimerDrawer = createAction(
  "MARKET_BUILD_CURRENCIES_LIST",
  useMarketCurrencies,
);

type MarketCurrenciesProps = {
  count: number,
  increment: number,
  counterValueCurrency: Currency,
};

export function useMarketCurrencies({
  counterValueCurrency,
  count,
  increment,
}: MarketCurrenciesProps) {
  const PERCENT_MULTIPLIER = 100;

  const currencies = listSupportedCurrencies();
  const c1 = currencies[0];

  const inputData = [];
  let t = Date.now() - count * increment;

  for (let i = 0; i < count; i++) {
    const date = new Date(t);
    inputData.push({ date, value: 0 });
    t += increment;
  }

  // TEST CODE
  const count1 = 24;
  const increment1 = 60 * 60 * 1000;
  const inputData2 = [];
  let time = Date.now() - count1 * increment1;

  const value1 = 10 ** c1.units[0].magnitude;
  for (let i = 0; i < count1; i++) {
    const date = new Date(time);
    inputData2.push({ date, value: value1 });
    time += increment1;
  }
  const test = useCalculateMany(inputData2, {
    from: c1,
    to: counterValueCurrency,
    disableRounding: false,
  });

  console.log("c1", c1);
  console.log("counterValueCurrency", counterValueCurrency);
  console.log("inputData2", inputData2);
  console.log("TEST", test);
  // END OF TEST CODE

  return currencies.map(currency => {
    const valueNum = 10 ** currency.units[0].magnitude;
    const value = valueNum instanceof BigNumber ? valueNum.toNumber() : valueNum;
    const currencyInputData = inputData.map(dataPoint => {
      dataPoint.value = value;

      return dataPoint;
    });
    const data =
      useCalculateMany(currencyInputData, {
        from: currency,
        to: counterValueCurrency,
        disableRounding: false,
      }) || [];
    currency.counterValue = data;
    currency.price = data[data.length - 1];
    const difference = data[data.length - 1] - data[0];
    currency.change = (difference / data[0]) * PERCENT_MULTIPLIER;

    return currency;
  });
}
