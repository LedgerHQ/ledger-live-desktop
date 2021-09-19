// @flow

import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";
import { useCalculateMany } from "@ledgerhq/live-common/lib/countervalues/react";
import { Currency } from "@ledgerhq/live-common/lib/types";

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

  const inputData = [];
  let t = Date.now() - count * increment;

  for (let i = 0; i < count; i++) {
    const date = new Date(t);
    inputData.push({ date, value: 0 });
    t += increment;
  }

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

    currency.variation = inputData.map(({ date }, i) => ({
      date,
      value: data[i] || 0,
    }));
    currency.price = data[data.length - 1] || 0;
    const difference = data[data.length - 1] - data[0] || 0;
    currency.change = ((difference / data[0]) * PERCENT_MULTIPLIER) || 0;

    return currency;
  });
}
