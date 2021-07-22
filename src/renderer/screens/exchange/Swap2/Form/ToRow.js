// @flow
import React from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import Input from "~/renderer/components/Input";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import { amountInputContainerProps, selectRowStylesMap } from "./utils";
import { FormLabel } from "./FormLabel";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types/currencies";

type Props = {
  toCurrency: ?CryptoCurrency,
  setToCurrency: (?CryptoCurrency) => void,
  toAmount: ?number,
  setToAmount: number => void,
};

export default function ToRow({ toCurrency, setToCurrency, toAmount, setToAmount }: Props) {
  // dummy
  const currencies = listCryptoCurrencies();

  return (
    <>
      <Box horizontal mb="8px" color={"palette.text.shade40"} fontSize={3}>
        <FormLabel>
          <Trans i18nKey="swap.form.to.title" />
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
          <Input
            type="number"
            value={toAmount}
            onChange={setToAmount}
            disabled={!toCurrency}
            placeholder="0"
            textAlign="right"
            containerProps={amountInputContainerProps}
          />
        </Box>
      </Box>
    </>
  );
}
