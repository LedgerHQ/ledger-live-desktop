// @flow
import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import { toSelector } from "~/renderer/actions/swap";
import { useSelector } from "react-redux";
import { useSelectableCurrencies } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

type Props = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  setToCurrency: $PropertyType<SwapTransactionType, "setToAccount">,
  toAmount: $PropertyType<SwapSelectorStateType, "amount">,
};

export default function ToRow({ toCurrency, setToCurrency, toAmount, fromAccount }: Props) {
  const fromCurrencyId = fromAccount ? getAccountCurrency(fromAccount).id : null;
  const allCurrencies = useSelector(toSelector)(fromCurrencyId);
  const selectState = useSelectableCurrencies({ currency: toCurrency, allCurrencies });
  const unit = selectState.account ? getAccountUnit(selectState.account) : null;

  /* @dev: save picked account */
  useEffect(() => {
    const { currency, account, parentAccount } = selectState;
    setToCurrency(currency, account, parentAccount);
  }, [selectState.currency]);

  useEffect(() => {
    /* RESET internal state on account change */
    selectState.setCurrency(null);
  }, [fromAccount]);

  return (
    <>
      <Box horizontal mb="8px" color={"palette.text.shade40"} fontSize={3}>
        <FormLabel>
          <Trans i18nKey="swap2.form.to.title" />
        </FormLabel>
      </Box>
      <Box horizontal>
        <Box width="50%">
          <SelectCurrency
            currencies={selectState.currencies}
            onChange={selectState.setCurrency}
            value={selectState.currency}
            stylesMap={selectRowStylesMap}
            isDisabled={!fromAccount}
          />
        </Box>
        <Box width="50%">
          <InputCurrency
            // @DEV: onChange props is required by the composant, there is no read-only logic
            onChange={() => {}}
            value={toAmount}
            disabled
            placeholder="0"
            textAlign="right"
            containerProps={amountInputContainerProps}
            unit={unit}
            // Flow complains if this prop is missing…
            renderRight={null}
          />
        </Box>
      </Box>
    </>
  );
}
