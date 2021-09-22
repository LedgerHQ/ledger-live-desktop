// @flow
import React from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { amountInputContainerProps, renderCurrencyValue, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import { toSelector } from "~/renderer/actions/swap";
import { useSelector } from "react-redux";
import {
  usePickDefaultCurrency,
  useSelectableCurrencies,
} from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import {
  Container as InputContainer,
  BaseContainer as BaseInputContainer,
} from "~/renderer/components/Input";
import styled from "styled-components";
import CounterValue from "~/renderer/components/CounterValue";
import { track } from "~/renderer/analytics/segment";
import { SWAP_VERSION } from "../../utils/index";

type Props = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  toAccount: $PropertyType<SwapSelectorStateType, "account">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  setToCurrency: $PropertyType<SwapTransactionType, "setToCurrency">,
  toAmount: $PropertyType<SwapSelectorStateType, "amount">,
  provider: ?string,
  loadingRates: boolean,
};

const InputCurrencyContainer = styled(Box)`
  ${InputContainer} {
    display: flex;
    background: none;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  ${BaseInputContainer} {
    flex: 0;
  }
`;

function ToRow({
  toCurrency,
  setToAccount,
  setToCurrency,
  toAmount,
  fromAccount,
  provider,
  toAccount,
  loadingRates,
}: Props) {
  const fromCurrencyId = fromAccount ? getAccountCurrency(fromAccount).id : null;
  const allCurrencies = useSelector(toSelector)(fromCurrencyId);
  const currencies = useSelectableCurrencies({ allCurrencies });
  const unit = toAccount ? getAccountUnit(toAccount) : null;

  usePickDefaultCurrency(currencies, toCurrency, setToCurrency);

  const trackEditCurrency = () =>
    track("Page Swap Form - Edit Target Currency", {
      targetcurrency: toCurrency,
      provider,
      swapVersion: SWAP_VERSION,
    });
  const setCurrencyAndTrack = currency => {
    track("Page Swap Form - New Target Currency", {
      targetcurrency: currency,
      provider,
      swapVersion: SWAP_VERSION,
    });
    setToCurrency(currency);
  };

  return (
    <>
      <Box horizontal color={"palette.text.shade40"} fontSize={3} mb={1}>
        <FormLabel>
          <Trans i18nKey="swap2.form.to.title" />
        </FormLabel>
      </Box>
      <Box horizontal>
        <Box flex="1">
          <SelectCurrency
            currencies={currencies}
            onChange={setCurrencyAndTrack}
            value={toCurrency}
            stylesMap={selectRowStylesMap}
            isDisabled={!fromAccount}
            renderValueOverride={renderCurrencyValue}
            onMenuOpen={trackEditCurrency}
          />
        </Box>
        <InputCurrencyContainer flex="1">
          <InputCurrency
            // @DEV: onChange props is required by the composant, there is no read-only logic
            onChange={() => {}}
            value={unit && toAmount}
            disabled
            placeholder="-"
            textAlign="right"
            fontWeight={600}
            color="palette.text.shade40"
            containerProps={amountInputContainerProps}
            unit={unit}
            loading={loadingRates}
            renderRight={
              toCurrency &&
              toAmount &&
              !loadingRates && (
                <CounterValue
                  currency={toCurrency}
                  value={toAmount}
                  color="palette.text.shade40"
                  ff="Inter|Medium"
                  fontSize={3}
                  pr={3}
                  mt="4px"
                  style={{ lineHeight: "1em" }}
                />
              )
            }
          />
        </InputCurrencyContainer>
      </Box>
    </>
  );
}
export default React.memo<Props>(ToRow);
