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
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import { useSelector } from "react-redux";
import { useSelectableCurrencies } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import getAccountLikeId from "~/renderer/screens/exchange/Swap2/utils/shared/getAccountLikeId";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
type Props = {
  fromAccount: ?AccountLike,
  toCurrency: ?CryptoCurrency,
  setToCurrency: (?CryptoCurrency) => void,
  toAmount: ?BigNumber,
  setToAmount: BigNumber => void,
};

export default function ToRow({
  toCurrency,
  setToCurrency,
  toAmount,
  setToAmount,
  fromAccount,
}: Props) {
  const fromAccountId = getAccountLikeId(fromAccount);
  const allCurrencies = useSelector(toSelector)(fromAccountId);
  const { currencies, availableAccounts } = useSelectableCurrencies({
    currency: toCurrency,
    allCurrencies,
  });

  /* @dev: Check if the selected currency is still available
   ** - If not, reset the state */
  useEffect(() => {
    if (currencies.includes(toCurrency)) return;

    setToCurrency(null);
  }, [currencies]);

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
            accounts={availableAccounts}
            currencies={currencies}
            onChange={setToCurrency}
            value={toCurrency}
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
            defaultUnit={toCurrency?.units[0]}
            // Flow complains if this prop is missing…
            renderRight={null}
          />
        </Box>
      </Box>
    </>
  );
}
