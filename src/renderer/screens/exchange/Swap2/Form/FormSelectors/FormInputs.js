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

type FormInputsProps = {
  fromAccount: $PropertyType<SwapSelectorStateType, "account">,
  fromAmount: $PropertyType<SwapSelectorStateType, "amount">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toAmount: $PropertyType<SwapSelectorStateType, "amount">,
  setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount">,
  setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount">,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  toggleMax: $PropertyType<SwapTransactionType, "toggleMax">,
  reverseSwap: $PropertyType<SwapTransactionType, "reverseSwap">,
  isMaxEnabled?: boolean,
  fromAmountError?: Error,
  isSwapReversable: boolean,
  loadingRates: boolean,
};

const RoundButton = styled(Button)`
  padding: 8px;
  border-radius: 9999px;
  height: initial;
`;

const Main = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 50px;
  margin-bottom: 5px;
`;

type SwapButtonProps = {
  onClick: $PropertyType<SwapTransactionType, "reverseSwap">,
  disabled: boolean,
};
function SwapButton({ onClick, disabled }: SwapButtonProps): React$Node {
  return (
    <RoundButton lighterPrimary disabled={disabled} onClick={onClick}>
      <ArrowsUpDown size={14} />
    </RoundButton>
  );
}

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
  reverseSwap,
  isSwapReversable,
  loadingRates,
}: FormInputsProps) {
  return (
    <Main>
      <Box>
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
      <Box horizontal justifyContent="center" alignContent="center">
        <SwapButton disabled={!isSwapReversable} onClick={reverseSwap} />
      </Box>
      <Box style={{ marginTop: "-23px" }}>
        <ToRow
          toCurrency={toCurrency}
          setToAccount={setToAccount}
          toAmount={toAmount}
          fromAccount={fromAccount}
          loadingRates={loadingRates}
        />
      </Box>
    </Main>
  );
}
