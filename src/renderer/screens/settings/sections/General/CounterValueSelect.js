// @flow

import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCounterValue } from "~/renderer/actions/settings";
import { counterValueCurrencySelector, supportedCountervalues } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";

const CounterValueSelect = React.memo<{}>(function CounterValueSelect() {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const dispatch = useDispatch();

  const handleChangeCounterValue = useCallback(
    item => {
      dispatch(setCounterValue(item.currency.ticker));
    },
    [dispatch],
  );

  const cvOption = useMemo(
    () => supportedCountervalues.find(f => f.value === counterValueCurrency.ticker),
    [counterValueCurrency],
  );

  return (
    <>
      <Track onUpdate event="CounterValueSelect" counterValue={cvOption && cvOption.value} />
      <Select
        small
        minWidth={260}
        onChange={handleChangeCounterValue}
        itemToString={item => (item ? item.name : "")}
        renderSelected={item => item && item.name}
        options={supportedCountervalues}
        value={cvOption}
      />
    </>
  );
});

export default CounterValueSelect;
