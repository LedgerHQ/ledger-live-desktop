// @flow

import React, { useCallback, useMemo, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Fuse from "fuse.js";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import useEnv from "~/renderer/hooks/useEnv";
import type { Option } from "~/renderer/components/Select";
import type { CreateStylesReturnType } from "~/renderer/components/Select/createStyles";
import Select from "~/renderer/components/Select";
import Box from "~/renderer/components/Box";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Text from "./Text";

type Props<C: Currency> = {
  onChange: (?C) => void,
  currencies: C[],
  value?: C,
  placeholder?: string,
  autoFocus?: boolean,
  minWidth?: number,
  width?: number,
  rowHeight?: number,
  isCurrencyDisabled?: Currency => boolean,
  isDisabled?: boolean,
  id?: string,
  renderOptionOverride?: (option: Option) => any,
  renderValueOverride?: (option: Option) => any,
  stylesMap?: CreateStylesReturnType => CreateStylesReturnType,
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
  rowHeight = 47,
  renderOptionOverride,
  renderValueOverride,
  isCurrencyDisabled,
  isDisabled,
  id,
  stylesMap,
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
    () =>
      cryptos.map(c => ({
        ...c,
        value: c,
        label: c.name,
        currency: c,
        isDisabled: isCurrencyDisabled ? isCurrencyDisabled(c) : false,
      })),
    [isCurrencyDisabled, cryptos],
  );

  const fuseOptions = useMemo(
    () => ({
      threshold: 0.1,
      keys: ["name", "ticker"],
      shouldSort: false,
    }),
    [],
  );

  const manualFilter = useCallback(() => {
    const fuse = new Fuse(options, fuseOptions);
    return searchInputValue.length > 0 ? fuse.search(searchInputValue) : options;
  }, [searchInputValue, options, fuseOptions]);

  const filteredOptions = manualFilter();
  return (
    <Select
      id={id}
      autoFocus={autoFocus}
      value={value}
      options={filteredOptions}
      filterOption={false}
      getOptionValue={getOptionValue}
      renderOption={renderOptionOverride || renderOption}
      renderValue={renderValueOverride || renderOptionOverride || renderOption}
      onInputChange={v => setSearchInputValue(v)}
      inputValue={searchInputValue}
      placeholder={placeholder || t("common.selectCurrency")}
      noOptionsMessage={noOptionsMessage}
      onChange={onChangeCallback}
      minWidth={minWidth}
      width={width}
      isDisabled={isDisabled}
      rowHeight={rowHeight}
      stylesMap={stylesMap}
    />
  );
};

const OptionMultilineContainer = styled(Box)`
  line-height: 1.3em;
`;
const CurrencyLabel = styled(Text).attrs(() => ({
  color: "palette.text.shade60",
  ff: "Inter|SemiBold",
  fontSize: 2,
}))`
  padding: 0 6px;
  height: 24px;
  line-height: 24px;
  border-color: currentColor;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  text-align: center;
  flex: 0 0 auto;
  box-sizing: content-box;
`;

export function CurrencyOption({
  currency,
  singleLineLayout = true,
  hideParentTag = false,
  tagVariant = "default",
}: {
  currency: Currency,
  singleLineLayout?: boolean,
  hideParentTag?: boolean,
  tagVariant?: "default" | "thin",
}) {
  const isParentTagDisplayed = !hideParentTag && currency.parentCurrency;

  const textContents = singleLineLayout ? (
    <>
      <Box grow ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
        {`${currency.name} (${currency.ticker})`}
      </Box>
      {isParentTagDisplayed ? <CurrencyLabel>{currency.parentCurrency.name}</CurrencyLabel> : null}
    </>
  ) : (
    <>
      <OptionMultilineContainer flex="1">
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
          {currency.name}
        </Text>
        <Box horizontal alignItems="center">
          <Text color="palette.text.shade40" ff="Inter|Medium" fontSize={3}>
            {currency.ticker}{" "}
            {isParentTagDisplayed && tagVariant === "thin"
              ? `(${currency.parentCurrency.name})`
              : null}
          </Text>
        </Box>
      </OptionMultilineContainer>
      {isParentTagDisplayed && tagVariant === "default" ? (
        <CurrencyLabel>{currency.parentCurrency.name}</CurrencyLabel>
      ) : null}
    </>
  );

  return (
    <Box grow horizontal alignItems="center" flow={2}>
      <CryptoCurrencyIcon circle currency={currency} size={26} />
      {textContents}
    </Box>
  );
}
const renderOption = ({ data: currency }: Option) => <CurrencyOption currency={currency} />;

export default memo<Props<*>>(SelectCurrency);
