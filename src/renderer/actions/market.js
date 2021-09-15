// @flow

import { createAction } from "redux-actions";
import { useSelector } from "react-redux";
import {
  counterValueCurrencySelector,
  countervalueFirstSelector,
  selectedTimeRangeSelector,
} from "~/renderer/reducers/settings";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { useCurrencyPortfolio } from "~/renderer/actions/portfolio";
import { BigNumber } from "bignumber.js";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";

export const openPlatformAppDisclaimerDrawer = createAction(
  "MARKET_BUILD_CURRENCIES_LIST",
  useMarketCurrenciesList,
);

export function useMarketCurrenciesList() {
  const range = useSelector(selectedTimeRangeSelector);
  const currencies = listCryptoCurrencies();
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const unit = counterValueCurrency.units[0];
  currencies.map(currency => {
    currency.change = useCurrencyPortfolio({ currency, range }).countervalueChange.percentage * 100 || 0;
    const effectiveUnit = unit || currency.units[0];
    const valueNum = 10 ** effectiveUnit.magnitude;
    const value = valueNum instanceof BigNumber ? valueNum.toNumber() : valueNum;
    currency.counterValue = useCalculate({
      from: currency,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    }) || 0
    return currency;
  })
  return currencies;
}
