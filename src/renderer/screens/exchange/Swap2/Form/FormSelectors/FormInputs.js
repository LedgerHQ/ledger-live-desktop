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
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  toggleMax: $PropertyType<SwapTransactionType, "toggleMax">,
  isMaxEnabled?: boolean,
  fromAmountError?: Error,
};

export default function FormInputs({
  fromAccount = null,
  fromAmount = null,
  isMaxEnabled = false,
  setFromAccount,
  setFromAmount,
  toCurrency,
  toAmount,
  setToAccount,
  toggleMax,
  fromAmountError,
}: FormInputsProps) {
  return (
    <section>
      <Box mb={5}>
        <FromRow
          fromAccount={fromAccount}
          setFromAccount={setFromAccount}
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          isMaxEnabled={isMaxEnabled}
          toggleMax={toggleMax}
          fromAmountError={fromAmountError}
        />
      </Box>
      <Box horizontal justifyContent="center" alignContent="center" mb={1}>
        <SwapButton />
      </Box>
      <Box mb={2}>
        <ToRow
          toCurrency={toCurrency}
          setToAccount={setToAccount}
          toAmount={toAmount}
          fromAccount={fromAccount}
        />
      </Box>
    </section>
  );
}
