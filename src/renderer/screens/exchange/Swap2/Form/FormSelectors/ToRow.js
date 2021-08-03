// @flow
import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import Box from "~/renderer/components/Box/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import { toSelector } from "~/renderer/actions/swap";
import { useSelector } from "react-redux";
import { useSelectableCurrencies } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import type { SwappableAccountType, toAccountType } from "./FormInputs";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { useSelectableCurrenciesReturnType } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";

type Props = {
  fromAccount: ?SwappableAccountType,
  toAccount: ?toAccountType,
  setToAccount: useSelectableCurrenciesReturnType => void,
  toAmount: ?BigNumber,
  setToAmount: BigNumber => void,
  resetToAccount: () => void,
};

export default function ToRow({
  toAccount,
  setToAccount,
  toAmount,
  setToAmount,
  fromAccount,
  resetToAccount,
}: Props) {
  const fromCurrencyId = fromAccount ? getAccountCurrency(fromAccount).id : null;
  const toCurrency = toAccount?.data?.account ? getAccountCurrency(toAccount.data.account) : null;
  const allCurrencies = useSelector(toSelector)(fromCurrencyId);
  const selectState = useSelectableCurrencies({ currency: toCurrency, allCurrencies });
  const unit = selectState.account ? getAccountUnit(selectState.account) : undefined;

  /* @dev: Check if the selected currency is still available
   ** - If not, reset the state */
  useEffect(() => {
    const isCurrentValueValids = selectState.currencies.find(({ id }) => id === toCurrency?.id);

    if (!isCurrentValueValids) {
      resetToAccount(); // TODO: would be a dispatch call in the future
      selectState.setCurrency(null);
    }
  }, [selectState.currencies]);

  /* @dev: save picked account */
  useEffect(() => {
    if (!toAccount && !selectState.account) return;

    // TODO: would be a dispatch call in the future
    setToAccount(selectState);
  }, [selectState.account, selectState.subAccount]);

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
          />
        </Box>
        <Box width="50%">
          <InputCurrency
            value={toAmount}
            onChange={setToAmount}
            disabled={!toCurrency}
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
