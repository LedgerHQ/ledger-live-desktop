// @flow

import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listSupportedFiats } from "@ledgerhq/live-common/lib/currencies";
import { setCounterValue } from "~/renderer/actions/settings";
import { counterValueCurrencySelector, possibleIntermediaries } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";

// TODO allow more cryptos as countervalues, then refactor this to common
const currencies = [...listSupportedFiats(), ...possibleIntermediaries].map(currency => ({
  value: currency.ticker,
  label: `${currency.name} - ${currency.ticker}`,
  currency,
}));

const CounterValueSelect = () => {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const dispatch = useDispatch();

  const handleChangeCounterValue = useCallback(
    item => {
      dispatch(setCounterValue(item.currency.ticker));
    },
    [dispatch],
  );

  const cvOption = useMemo(() => currencies.find(f => f.value === counterValueCurrency.ticker), [
    counterValueCurrency,
  ]);

  return (
    <>
      <Track onUpdate event="CounterValueSelect" counterValue={cvOption && cvOption.value} />
      <Select
        small
        minWidth={260}
        onChange={handleChangeCounterValue}
        itemToString={item => (item ? item.name : "")}
        renderSelected={item => item && item.name}
        options={currencies}
        value={cvOption}
      />
    </>
  );
};

export default CounterValueSelect;
