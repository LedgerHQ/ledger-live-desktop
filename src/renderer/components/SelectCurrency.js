// @flow

import React, { useCallback, useMemo, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import Fuse from "fuse.js";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import useEnv from "~/renderer/hooks/useEnv";
import type { Option } from "~/renderer/components/Select";
import Select from "~/renderer/components/Select";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

type Props<C: Currency> = {
  onChange: (?C) => void,
  currencies: C[],
  value?: C,
  placeholder?: string,
  autoFocus?: boolean,
  minWidth?: number,
  width?: number,
};

const getOptionValue = c => c.id;

// TODO: I removed the {...props} that was passed to Select. We might need to check out it doesnt break other stuff
const SelectCurrency = <C: Currency>({
  onChange,
  value,
  placeholder,
  currencies,
  autoFocus,
  minWidth,
  width,
}: Props<C>) => {
  const { t } = useTranslation();
  const devMode = useEnv("MANAGER_DEV_MODE");
  let c = currencies;
  if (!devMode) {
    c = c.filter(c => c.type !== "CryptoCurrency" || !c.isTestnetFor);
  }
  const [searchInputValue, setSearchInputValue] = useState("");

  const cryptos = useCurrenciesByMarketcap(c);
  const onChangeCallback = useCallback(item => onChange(item ? item.currency : null), [onChange]);
  const noOptionsMessage = useCallback(
    ({ inputValue }: { inputValue: string }) =>
      t("common.selectCurrencyNoOption", { currencyName: inputValue }),
    [t],
  );

  const options = useMemo(
    () => cryptos.map(c => ({ ...c, value: c, label: c.name, currency: c })),
    [cryptos],
  );

  const fuseOptions = {
    threshold: 0.1,
    keys: ["name", "ticker"],
    shouldSort: false,
  };
  const manualFilter = useCallback(() => {
    const fuse = new Fuse(options, fuseOptions);
    return searchInputValue.length > 0 ? fuse.search(searchInputValue) : options;
  }, [searchInputValue, options, fuseOptions]);

  const filteredOptions = manualFilter();
  return (
    <Select
      autoFocus={autoFocus}
      value={value}
      options={filteredOptions}
      filterOption={false}
      getOptionValue={getOptionValue}
      renderOption={renderOption}
      renderValue={renderOption}
      onInputChange={v => setSearchInputValue(v)}
      inputValue={searchInputValue}
      placeholder={placeholder || t("common.selectCurrency")}
      noOptionsMessage={noOptionsMessage}
      onChange={onChangeCallback}
      minWidth={minWidth}
      width={width}
    />
  );
};

const renderOption = ({ data: currency }: Option) => (
  <Box grow horizontal alignItems="center" flow={2}>
    <CryptoCurrencyIcon currency={currency} size={16} />
    <Box grow ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
      {`${currency.name} (${currency.ticker})`}
    </Box>
  </Box>
);

export default memo<Props<*>>(SelectCurrency);
