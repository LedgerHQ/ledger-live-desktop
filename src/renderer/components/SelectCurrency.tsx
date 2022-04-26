import React, { useCallback, useMemo, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Fuse from "fuse.js";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import useEnv from "~/renderer/hooks/useEnv";
import { CreateStylesReturnType } from "~/renderer/components/Select/createStyles";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { SelectInput, Text, Flex } from "@ledgerhq/react-ui";
import { Props as SelectInputProps } from "@ledgerhq/react-ui/components/form/SelectInput";
import {
  Props as OptionProps,
  Option,
} from "@ledgerhq/react-ui/components/form/SelectInput/Option";

// TODO: update react-select just before V3 gets merged instead of relying on a nested version…
import {
  components,
  SingleValueProps,
  ValueContainerProps,
  ControlProps,
} from "@ledgerhq/react-ui/node_modules/react-select";

// it seems this component only uses crypto and token currencies, not fiat ones
// since it uses the 'id' prop that is not present on fiat currencies
type Currency = CryptoCurrency | TokenCurrency;

type Props = {
  onChange: (currency?: Currency) => void;
  currencies: Currency[];
  value?: Currency;
  placeholder?: string;
  autoFocus?: boolean;
  minWidth?: number;
  width?: number;
  rowHeight?: number;
  isCurrencyDisabled?: (currency: Currency) => boolean;
  isDisabled?: boolean;
  id?: string;
  renderOptionOverride?: (option: OptionProps<Currency>) => JSX.Element;
  renderValueOverride?: (option: ValueContainerProps<Currency, false>) => JSX.Element;
  stylesMap?: (styles: CreateStylesReturnType) => CreateStylesReturnType;
};

const getOptionValue = (c: Currency) => c.id;

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
  hideParentTag = false,
  isSelectedValue = false,
}: {
  currency: Currency;
  hideParentTag?: boolean;
  isSelectedValue?: boolean;
}) {
  const isParentTagDisplayed = !hideParentTag && (currency as TokenCurrency).parentCurrency;

  const textContents = (
    <>
      <Text ff="Inter|SemiBold" color="inherit" fontSize={4}>
        {`${currency.name} (${currency.ticker})`}
      </Text>
      {isParentTagDisplayed ? (
        <CurrencyLabel>{(currency as TokenCurrency).parentCurrency.name}</CurrencyLabel>
      ) : null}
    </>
  );

  return (
    <Flex flexGrow={1} alignItems="center" columnGap={4} height={48}>
      {!isSelectedValue && (
        <Text color="neutral.c00">
          <CryptoCurrencyIcon circle currency={currency} size={26} />
        </Text>
      )}
      {textContents}
    </Flex>
  );
}

const renderOption = (props: OptionProps<Currency, false>) => {
  return <Option {...props} render={({ data }) => <CurrencyOption currency={data} />} />;
};

const renderValue = (props: SingleValueProps<Currency, false>) => {
  return (
    <components.SingleValue {...props}>
      <CurrencyOption currency={props.getValue()[0]} isSelectedValue />
    </components.SingleValue>
  );
};

const renderLeft = (props: ControlProps<Currency>) => {
  const value = props.getValue()[0];
  return (
    value && (
      <Flex ml={-4} mr={2}>
        <Text color="neutral.c00">
          <CryptoCurrencyIcon circle currency={value} size={26} />
        </Text>
      </Flex>
    )
  );
};

// TODO: I removed the {...props} that was passed to Select. We might need to check out it doesnt break other stuff
const SelectCurrency = ({
  onChange,
  value,
  placeholder,
  currencies,
  autoFocus = false,
  minWidth,
  width,
  rowHeight = 47,
  renderOptionOverride,
  renderValueOverride,
  isCurrencyDisabled,
  isDisabled,
  id,
}: Props) => {
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

  const styles = useMemo<SelectInputProps<Currency>["styles"]>(
    () => ({
      input: provided => ({
        ...provided,
        width: `${width}px`,
        minWidth: `${minWidth}px`,
      }),
    }),
    [width, minWidth],
  );

  const filteredOptions = manualFilter();
  return (
    <SelectInput
      options={filteredOptions}
      onChange={onChangeCallback}
      value={value}
      components={{
        Option: renderOptionOverride ?? renderOption,
        SingleValue: renderValueOverride ?? renderValue,
      }}
      placeholder={placeholder || t("common.selectCurrency")}
      autoFocus={!process.env.SPECTRON_RUN ? autoFocus : false}
      styles={styles}
      id={id}
      noOptionsMessage={noOptionsMessage}
      inputValue={searchInputValue}
      onInputChange={v => setSearchInputValue(v)}
      getOptionValue={getOptionValue}
      isDisabled={isDisabled}
      rowHeight={rowHeight}
      menuPortalTarget={document.body}
      renderLeft={renderLeft}
    />
  );
};

export default memo(SelectCurrency);
