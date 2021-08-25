// @flow
import React, { useState } from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ArrowsUpDown from "~/renderer/icons/ArrowsUpDown";
import styled from "styled-components";
import FromRow from "./FromRow";
import ToRow from "./ToRow";
import type {
  Account,
  TokenAccount,
  TokenCurrency,
  CryptoCurrency,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import type { useSelectableCurrenciesReturnType } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import type { State as SwapTransactionType } from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

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

export type toAccountType = {
  account: Account | TokenAccount,
  parentAccount: Account | null,
  currency: (TokenCurrency | CryptoCurrency) | null,
} | null;

type FormInputsProps = {
  fromAccount: $PropertyType<SwapTransactionType, "account">,
  fromAmount?: $PropertyType<Transaction, "amount">,
  isMaxEnabled?: boolean,
  setFromAccount: (account: $PropertyType<SwapTransactionType, "account">) => void,
  setFromAmount: (amount: $PropertyType<Transaction, "amount">) => void,
  toggleMax: () => void,
  fromAmountError?: Error,
};

export default function FormInputs({
  fromAccount = null,
  fromAmount = null,
  isMaxEnabled = false,
  setFromAccount,
  setFromAmount,
  toggleMax,
  fromAmountError,
}: FormInputsProps) {
  const [toAccount, setToAccount] = useState(null);
  const [toAmount, setToAmount] = useState(null);

  const handleSetToAccountChange = (selectSate: useSelectableCurrenciesReturnType) => {
    setToAccount({
      account: selectSate.account ?? null,
      parentAccount: selectSate.parentAccount ?? null,
      currency: selectSate.currency,
    });
  };

  return (
    <section>
      <FromRow
        fromAccount={fromAccount}
        setFromAccount={setFromAccount}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
        isMaxEnabled={isMaxEnabled}
        toggleMax={toggleMax}
        fromAmountError={fromAmountError}
      />

      <Box horizontal justifyContent="center" alignContent="center">
        <SwapButton />
      </Box>
      <ToRow
        toAccount={toAccount}
        // $FlowFixMe
        setToAccount={handleSetToAccountChange}
        toAmount={toAmount}
        setToAmount={setToAmount}
        fromAccount={fromAccount}
      />
    </section>
  );
}
