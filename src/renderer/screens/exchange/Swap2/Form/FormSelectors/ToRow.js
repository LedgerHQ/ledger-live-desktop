// @flow
import React from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import Box from "~/renderer/components/Box/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types/currencies";

type Props = {
  toCurrency: ?CryptoCurrency,
  setToCurrency: (?CryptoCurrency) => void,
  toAmount: ?BigNumber,
  setToAmount: BigNumber => void,
};

export default function ToRow({ toCurrency, setToCurrency, toAmount, setToAmount }: Props) {
  // dummy
  const currencies = listCryptoCurrencies();
  const unit = toCurrency && toCurrency.units[0];

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
            // $FlowFixMe
            unit={unit}
            // Flow complains if this prop is missing…
            renderRight={null}
          />
        </Box>
      </Box>
    </>
  );
}
