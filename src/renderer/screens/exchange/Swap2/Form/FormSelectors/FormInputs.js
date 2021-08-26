// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ArrowsUpDown from "~/renderer/icons/ArrowsUpDown";
import styled from "styled-components";
import FromRow from "./FromRow";
import ToRow from "./ToRow";
import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

const RoundButton = styled(Button)`
  padding: 8px;
  border-radius: 9999px;
  height: initial;
`;
function SwapButton() {
  return (
    <RoundButton lighterPrimary>
      <ArrowsUpDown size={14} />
    </RoundButton>
  );
}

type FormInputsProps = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  fromAmount: $PropertyType<SwapSelectorStateType, "amount">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toAmount: $PropertyType<SwapSelectorStateType, "amount">,
  setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount">,
  setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount">,
  setToCurrency: $PropertyType<SwapTransactionType, "setToAccount">,
  toggleMax: $PropertyType<SwapTransactionType, "toggleMax">,
  isMaxEnabled?: boolean,
};

export default function FormInputs({
  fromAccount = null,
  fromAmount = null,
  isMaxEnabled = false,
  setFromAccount,
  setFromAmount,
  toCurrency,
  toAmount,
  setToCurrency,
  toggleMax,
}: FormInputsProps) {
  return (
    <section>
      <FromRow
        fromAccount={fromAccount}
        setFromAccount={setFromAccount}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
        isMaxEnabled={isMaxEnabled}
        toggleMax={toggleMax}
      />

      <Box horizontal justifyContent="center" alignContent="center">
        <SwapButton />
      </Box>
      <ToRow
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        toAmount={toAmount}
        fromAccount={fromAccount}
      />
    </section>
  );
}
