// @flow
import { useState, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Result as useBridgeTransactionReturnType } from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/currencies";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  Account,
  TokenAccount,
  TokenCurrency,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";
import { AmountRequired } from "@ledgerhq/errors";

import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

export type SwapSelectorStateType = {
  currency: null | TokenCurrency | CryptoCurrency,
  account: null | Account | TokenAccount,
  parentAccount: null | Account,
  amount: null | BigNumber,
};
const SelectorStateDefaultValues = {
  currency: null,
  account: null,
  parentAccount: null,
  amount: null,
};

export type SwapTransactionType = {
  ...useBridgeTransactionReturnType,
  swap: { to: SwapSelectorStateType, from: SwapSelectorStateType },
  setFromAccount: (account: $PropertyType<SwapSelectorStateType, "account">) => void,
  setToAccount: (
    currency: $PropertyType<SwapSelectorStateType, "currency">,
    account: $PropertyType<SwapSelectorStateType, "account">,
    parentAccount: $PropertyType<SwapSelectorStateType, "parentAccount">,
  ) => void,
  setFromAmount: (amount: BigNumber) => void,
  setToAmount: (amount: BigNumber) => void,
  toggleMax: () => Promise<void>,
};

const useSwapTransaction = (): SwapTransactionType => {
  const [toState, setToState] = useState<SwapSelectorStateType>(SelectorStateDefaultValues);
  const [fromState, setFromState] = useState<SwapSelectorStateType>(SelectorStateDefaultValues);
  const allAccounts = useSelector(shallowAccountsSelector);
  const bridgeTransaction = useBridgeTransaction();
  const fromAmountError = useMemo(() => {
    const [error] = [
      bridgeTransaction.status.errors?.gasPrice,
      bridgeTransaction.status.errors?.amount,
    ]
      .filter(Boolean)
      .filter(error => !(error instanceof AmountRequired));

    return error;
  }, [bridgeTransaction.status.errors?.gasPrice, bridgeTransaction.status.errors?.amount]);

  /* UPDATE from account */
  const setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount"> = account => {
    const parentAccount =
      account?.type !== "Account" ? allAccounts.find(a => a.id === account?.parentId) : null;
    const mainAccount = getMainAccount(account, parentAccount);
    const currency = getAccountCurrency(mainAccount);

    bridgeTransaction.setAccount(account, parentAccount);
    setFromState({ ...SelectorStateDefaultValues, currency, account, parentAccount });
    setToState(SelectorStateDefaultValues);

    /* @DEV: That populates fake seed. This is required to use Transaction object */
    const recipient = getAbandonSeedAddress(currency.id);
    bridgeTransaction.updateTransaction(transaction => ({ ...transaction, recipient }));
  };

  /* UPDATE to accounts */
  const setToAccount: $PropertyType<SwapTransactionType, "setToAccount"> = (
    currency,
    account,
    parentAccount,
  ) => setToState({ ...SelectorStateDefaultValues, currency, account, parentAccount });

  const setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount"> = amount => {
    bridgeTransaction.updateTransaction(transaction => ({ ...transaction, amount }));
    setFromState(previousState => ({ ...previousState, amount: amount }));
  };

  const setToAmount: $PropertyType<SwapTransactionType, "setToAmount"> = amount =>
    setToState(previousState => ({ ...previousState, amount: amount }));

  const toggleMax: $PropertyType<SwapTransactionType, "toggleMax"> = async () => {
    /* UPDATE useAllAmount value */
    const useAllAmount = !bridgeTransaction.transaction.useAllAmount;
    bridgeTransaction.updateTransaction(transaction => ({ ...transaction, useAllAmount }));

    /* UPDATE amount to the max value if needed */
    if (useAllAmount) {
      const bridge = getAccountBridge(bridgeTransaction.account, bridgeTransaction.parentAccount);
      const amount = await bridge.estimateMaxSpendable({
        account: bridgeTransaction.account,
        parentAccount: bridgeTransaction.parentAccount,
      });

      setFromAmount(amount);
    }
  };

  return {
    ...bridgeTransaction,
    swap: { to: toState, from: fromState },
    setFromAmount,
    toggleMax,
    fromAmountError,
    setToAccount,
    setFromAccount,
    setToAmount,
  };
};

export default useSwapTransaction;
