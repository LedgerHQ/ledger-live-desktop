import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCounterValue } from "~/renderer/actions/settings";
import { counterValueCurrencySelector, supportedCountervalues } from "~/renderer/reducers/settings";
import { Dropdown } from "@ledgerhq/react-ui";
import Track from "~/renderer/analytics/Track";
import { useTranslation } from "react-i18next";

const CounterValueSelect = React.memo(function CounterValueSelect() {
  const { t } = useTranslation();
  const counterValueCurrency: any = useSelector(counterValueCurrencySelector);
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
      <Dropdown
        label={t("market.currency")}
        name="currency"
        menuPortalTarget={document.body}
        onChange={handleChangeCounterValue}
        options={supportedCountervalues}
        value={cvOption}
      />
    </>
  );
});

export default CounterValueSelect;
