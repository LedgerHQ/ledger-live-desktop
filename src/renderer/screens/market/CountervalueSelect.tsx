import React, { useCallback, useMemo, memo } from "react";
import { supportedCountervalues } from "~/renderer/reducers/settings";

import Dropdown from "./DropDown";
import Track from "~/renderer/analytics/Track";
import { useTranslation } from "react-i18next";

type Props = {
  counterCurrency: string;
  setCounterCurrency: (counterCurrency: string) => void;
  supportedCounterCurrencies: string[];
};

function CounterValueSelect({
  counterCurrency,
  setCounterCurrency,
  supportedCounterCurrencies,
}: Props) {
  const { t } = useTranslation();

  const handleChangeCounterValue = useCallback(
    item => {
      setCounterCurrency(item.currency.ticker);
    },
    [setCounterCurrency],
  );

  const options = useMemo(
    () =>
      supportedCountervalues.filter(({ value }) =>
        supportedCounterCurrencies.includes(value.toLowerCase()),
      ),
    [supportedCounterCurrencies],
  );

  const cvOption = useMemo(
    () => supportedCountervalues.find(f => f.value.toLowerCase() === counterCurrency.toLowerCase()),
    [counterCurrency],
  );

  return (
    <>
      <Track onUpdate event="MarketCounterValueSelect" counterValue={cvOption && cvOption.value} />
      <Dropdown
        label={t("market.currency")}
        name="currency"
        menuPortalTarget={document.body}
        onChange={handleChangeCounterValue}
        options={options}
        value={cvOption}
        searchable
      />
    </>
  );
}

export default memo<Props>(CounterValueSelect);
