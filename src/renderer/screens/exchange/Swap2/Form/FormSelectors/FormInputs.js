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
} from "@ledgerhq/live-common/lib/types";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import type { useSelectableCurrenciesReturnType } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";

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

export type toAccountType =
  | {
      // User already has an account to accept target currency
      targetAccountExists: true,
      account: Account | TokenAccount,
      parentAccount: ?Account,
      currency: ?(TokenCurrency | CryptoCurrency),
    }
  | {
      // User doesn't have an account to accept target currency
      targetAccountExists: false,
      account: null,
      parentAccount: null,
      currency: ?(TokenCurrency | CryptoCurrency),
    }
  // No target currency selected
  | null;

export default function FormInputs() {
  // TODO: would be moved to a reducer
  const [fromAccount, setFromAccount] = useState<{
    account: Account | TokenAccount,
    parentAccount: ?Account,
    currency: ?(TokenCurrency | CryptoCurrency),
  } | null>(null);
  const [fromAmount, setFromAmount] = useState(null);
  const [toAccount, setToAccount] = useState<toAccountType>(null);
  const [toAmount, setToAmount] = useState(null);

  // TODO: would be handled by the reducer in the future
  const handleSetToAccountChange = (selectSate: useSelectableCurrenciesReturnType) => {
    const data = selectSate.account
      ? {
          targetAccountExists: true,
          account: selectSate.account,
          parentAccount: selectSate.parentAccount,
          currency: selectSate.currency,
        }
      : {
          targetAccountExists: false,
          account: null,
          parentAccount: null,
          currency: selectSate.currency,
        };

    setToAccount(data);
  };

  // TODO: would be handled by the reducer in the future
  const handleSetFromAccountChange = (
    pickedAccount: Account | TokenAccount,
    accounts: Array<Account>,
  ): void => {
    const parentAccount =
      pickedAccount?.type !== "Account"
        ? accounts.find(a => a.id === pickedAccount?.parentId)
        : null;

    const currency = getAccountCurrency(pickedAccount);
    setFromAccount({ account: pickedAccount, parentAccount, currency });
  };

  // TODO: would be handled by the reducer in the future
  const resetToAccount = () => setToAccount(null);

  return (
    <section>
      <FromRow
        fromAccount={fromAccount}
        setFromAccount={handleSetFromAccountChange}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
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
        fromAccount={fromAccount?.account}
        resetToAccount={resetToAccount}
      />
    </section>
  );
}
