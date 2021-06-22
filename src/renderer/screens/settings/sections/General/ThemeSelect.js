//  @flow

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setTheme, setThemeCurrency } from "~/renderer/actions/settings";
import { userThemeSelector, userThemeCurrencySelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import Box from "~/renderer/components/Box/Box";

import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";

const themeLabels = {
  light: "theme.light",
  dusk: "theme.dusk",
  dark: "theme.dark",
};

const ThemeSelect = () => {
  const dispatch = useDispatch();
  const theme = useSelector(userThemeSelector);
  const themeCurrency = useSelector(userThemeCurrencySelector);
  const { t } = useTranslation();

  const setCurrencyTheme = useCallback(c => {
    dispatch(setThemeCurrency(c));
  }, []);

  const handleChangeTheme = useCallback(
    ({ value: themeKey }: { value: string }) => {
      dispatch(setTheme(themeKey));
    },
    [dispatch],
  );

  const options = useMemo(
    () =>
      [{ value: null, label: t("theme.system") }].concat(
        Object.keys(themeLabels).map(key => ({
          value: key,
          label: t(themeLabels[key]),
        })),
      ),
    [t],
  );

  const renderOption = useCallback(({ data: currency }) => {
    return (
      <Box grow horizontal alignItems="center" flow={2}>
        <CryptoCurrencyIcon circle currency={currency} size={26} />
        <Box grow ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          {`${currency.name} (${currency.ticker})`}
        </Box>
      </Box>
    );
  }, []);

  const currencies = useMemo(
    () =>
      listCryptoCurrencies()
        .filter(getCryptoCurrencyIcon)
        .sort((a, b) => parseInt(a.color.slice(1), 16) - parseInt(b.color.slice(1), 16)),
    [],
  );

  const currentTheme = options.find(option => option.value === theme);

  return (
    <>
      <Track onUpdate event="ThemeSelect" currentTheme={theme} />
      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeTheme}
        value={currentTheme}
        options={options}
      />
      <Box mt={2}>
        <SelectCurrency
          currencies={currencies}
          autoFocus
          onChange={setCurrencyTheme}
          value={themeCurrency}
          renderOptionOverride={renderOption}
        />
      </Box>
    </>
  );
};

export default ThemeSelect;
