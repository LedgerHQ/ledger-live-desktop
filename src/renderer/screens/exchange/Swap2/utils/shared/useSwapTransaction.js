// @flow
import { useState, useMemo, useEffect } from "react";
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
export type SwapDataType = {
  from: SwapSelectorStateType,
  to: SwapSelectorStateType,
  isMaxEnabled: boolean,
};

const SelectorStateDefaultValues = {
  currency: null,
  account: null,
  parentAccount: null,
  amount: null,
};

export type SwapTransactionType = {
  ...useBridgeTransactionReturnType,
  swap: SwapDataType,
  setFromAccount: (account: $PropertyType<SwapSelectorStateType, "account">) => void,
  setToAccount: (
    currency: $PropertyType<SwapSelectorStateType, "currency">,
    account: $PropertyType<SwapSelectorStateType, "account">,
    parentAccount: $PropertyType<SwapSelectorStateType, "parentAccount">,
  ) => void,
  setFromAmount: (amount: BigNumber) => void,
  setToAmount: (amount: BigNumber) => void,
  toggleMax: () => void,
};

const useSwapTransaction = (): SwapTransactionType => {
  const [toState, setToState] = useState<SwapSelectorStateType>(SelectorStateDefaultValues);
  const [fromState, setFromState] = useState<SwapSelectorStateType>(SelectorStateDefaultValues);
  const [isMaxEnabled, setMax] = useState<$PropertyType<SwapDataType, "isMaxEnabled">>(false);
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

  /* UPDATE from amount to the estimate max spendable on account 
  change when the amount feature is enabled */
  useEffect(() => {
    const updateAmountUsingMax = async () => {
      const bridge = getAccountBridge(bridgeTransaction.account, bridgeTransaction.parentAccount);
      const amount = await bridge.estimateMaxSpendable({
        account: bridgeTransaction.account,
        parentAccount: bridgeTransaction.parentAccount,
      });
      setFromAmount(amount);
    };

    if (isMaxEnabled) updateAmountUsingMax();
  }, [isMaxEnabled, fromState.account]);

  const toggleMax: $PropertyType<SwapTransactionType, "toggleMax"> = () =>
    setMax(previous => !previous);

  const swap = { to: toState, from: fromState, isMaxEnabled };

  return {
    ...bridgeTransaction,
    swap,
    setFromAmount,
    toggleMax,
    fromAmountError,
    setToAccount,
    setFromAccount,
    setToAmount,
  };
};

export default useSwapTransaction;
