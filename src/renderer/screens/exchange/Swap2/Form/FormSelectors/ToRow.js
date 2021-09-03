// @flow
import React, { useEffect, useRef } from "react";
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
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

type Props = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  toAmount: $PropertyType<SwapSelectorStateType, "amount">,
};

export default function ToRow({ toCurrency, setToAccount, toAmount, fromAccount }: Props) {
  const fromCurrencyId = fromAccount ? getAccountCurrency(fromAccount).id : null;
  const allCurrencies = useSelector(toSelector)(fromCurrencyId);
  const selectState = useSelectableCurrencies({ allCurrencies });
  const unit = selectState.account ? getAccountUnit(selectState.account) : null;
  const accounts = useSelector(shallowAccountsSelector);

  /* @dev: save picked account */
  useEffect(() => {
    const { currency, account, parentAccount } = selectState;
    setToAccount(currency, account, parentAccount);
  }, [fromAccount, selectState.currency]);

  /* Force refresh or reset internal state on account change */
  const previousFromAccountRef = useRef(fromAccount);
  useEffect(() => {
    const previousFromAccount = previousFromAccountRef.current;
    if (previousFromAccount === fromAccount) return;
    const isCurrencyValid = selectState.currencies.indexOf(selectState.currency) >= 0;
    selectState.setCurrency(isCurrencyValid ? selectState.currency : null);
    return () => {
      previousFromAccountRef.current = fromAccount;
    };
  }, [fromAccount, selectState.currencies, selectState.currency]);

  /* REFRESH picked currency information (account/parentAccount)
   when an account is added or removed by the user */
  useEffect(() => {
    if (selectState.currency) selectState.setCurrency(selectState.currency);
  }, [accounts]);

  usePickDefaultCurrency(selectState.currencies, selectState.currency, selectState.setCurrency);

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
            renderValueOverride={renderCurrencyValue}
          />
        </Box>
        <Box width="50%">
          <InputCurrency
            // @DEV: onChange props is required by the composant, there is no read-only logic
            onChange={() => {}}
            value={unit && toAmount}
            disabled
            placeholder="-"
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
