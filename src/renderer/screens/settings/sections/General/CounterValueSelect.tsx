import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCounterValue } from "~/renderer/actions/settings";
import { counterValueCurrencySelector, supportedCountervalues } from "~/renderer/reducers/settings";
import { SelectInput } from "@ledgerhq/react-ui";
import Track from "~/renderer/analytics/Track";

const CounterValueSelect = React.memo(function CounterValueSelect() {
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
      <SelectInput
        onChange={handleChangeCounterValue}
        options={supportedCountervalues}
        value={cvOption}
        styles={{ input: provided => ({ ...provided, width: "210px" }) }}
      />
    </>
  );
});

export default CounterValueSelect;
