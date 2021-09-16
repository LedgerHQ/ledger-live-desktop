// @flow
import { useState, useReducer, useMemo, useEffect, useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Result as useBridgeTransactionReturnType } from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import getExchangeRates from "@ledgerhq/live-common/lib/exchange/swap/getExchangeRates";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/currencies";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  Account,
  TokenAccount,
  TokenCurrency,
  CryptoCurrency,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/types";
import { AmountRequired } from "@ledgerhq/errors";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account/helpers";

import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { track } from "~/renderer/analytics/segment";

type RatesReducerState = {
  status?: ?string,
  value?: ExchangeRate[],
  error?: Error,
};
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
  isSwapReversable: boolean,
  rates: RatesReducerState,
  refetchRates: () => void,
};

const SelectorStateDefaultValues = {
  currency: null,
  account: null,
  parentAccount: null,
  amount: null,
};

const ratesReducerInitialState: RatesReducerState = {};
const ratesReducer = (state: RatesReducerState, action): RatesReducerState => {
  switch (action.type) {
    case "set":
      return { value: action.payload };
    case "idle":
      return { ...state, status: null };
    case "loading":
      return { ...state, status: "loading" };
    case "error":
      return { status: "error", error: action.payload };
  }
  return state;
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
  reverseSwap: () => void,
};

const useSwapTransaction = ({
  defaultCurrency,
  defaultAccount,
  defaultParentAccount,
}: {
  defaultCurrency?: $PropertyType<SwapSelectorStateType, "currency">,
  defaultAccount?: $PropertyType<SwapSelectorStateType, "account">,
  defaultParentAccount?: $PropertyType<SwapSelectorStateType, "parentAccount">,
} = {}): SwapTransactionType => {
  const [toState, setToState] = useState<SwapSelectorStateType>(SelectorStateDefaultValues);
  const [fromState, setFromState] = useState<SwapSelectorStateType>({
    ...SelectorStateDefaultValues,
    currency: defaultCurrency ?? SelectorStateDefaultValues.currency,
    account: defaultAccount ?? SelectorStateDefaultValues.account,
    parentAccount: defaultParentAccount ?? SelectorStateDefaultValues.parentAccount,
  });
  const [isMaxEnabled, setMax] = useState<$PropertyType<SwapDataType, "isMaxEnabled">>(false);
  const [rates, dispatchRates] = useReducer(ratesReducer, ratesReducerInitialState);
  const [getRatesDependency, setGetRatesDependency] = useState(null);
  const refetchRates = useCallback(() => setGetRatesDependency({}), []);
  const allAccounts = useSelector(shallowAccountsSelector);
  const bridgeTransaction = useBridgeTransaction(() => ({
    account: fromState.account,
    parentAccount: fromState.parentAccount,
  }));
  const fromAmountError = useMemo(() => {
    const [error] = [
      bridgeTransaction.status.errors?.gasPrice,
      bridgeTransaction.status.errors?.amount,
    ]
      .filter(Boolean)
      .filter(error => !(error instanceof AmountRequired));

    return error;
  }, [bridgeTransaction.status.errors?.gasPrice, bridgeTransaction.status.errors?.amount]);
  const isSwapReversable = useMemo(() => {
    if (!toState.account || !fromState.currency) return false;

    const allAccounstWithSub = flattenAccounts(allAccounts);
    const isToSwappable = !!allAccounstWithSub.find(account => account.id === toState.account?.id);

    return isToSwappable;
  }, [toState.account, fromState.currency, allAccounts]);

  /* UPDATE from account */
  const setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount"> = account => {
    const parentAccount =
      account?.type !== "Account" ? allAccounts.find(a => a.id === account?.parentId) : null;
    const currency = getAccountCurrency(account);

    bridgeTransaction.setAccount(account, parentAccount);
    setFromState({ ...SelectorStateDefaultValues, currency, account, parentAccount });
    setToState(SelectorStateDefaultValues);

    /* @DEV: That populates fake seed. This is required to use Transaction object */
    const mainAccount = getMainAccount(account, parentAccount);
    const mainCurrency = getAccountCurrency(mainAccount);
    const recipient = getAbandonSeedAddress(mainCurrency.id);
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
        transaction: bridgeTransaction?.transaction,
      });
      setFromAmount(amount);
    };

    isMaxEnabled ? updateAmountUsingMax() : setFromAmount(new BigNumber(0));
  }, [isMaxEnabled, fromState.account, bridgeTransaction?.transaction?.feesStrategy]);

  /* Fetch and update provider rates. */
  const { account: fromAccount, parentAccount: fromParentAccount } = fromState;
  const { account: toAccount, parentAccount: toParentAccount, currency: toCurrency } = toState;
  const transaction = bridgeTransaction?.transaction;
  useEffect(() => {
    let abort = false;
    async function getRates() {
      if (
        !transaction ||
        !transaction?.amount ||
        !transaction?.amount.gt(0) ||
        !toAccount ||
        !fromAccount ||
        getAccountCurrency(toAccount) !== toCurrency
      ) {
        return dispatchRates({ type: "set", payload: [] });
      }
      dispatchRates({ type: "loading" });
      try {
        let rates: Array<ExchangeRate> = await getExchangeRates(
          { fromAccount, fromParentAccount, toAccount, toParentAccount },
          transaction,
        );
        if (abort) return;
        if (rates.length === 0) {
          track("Page Swap Form - Error No Rate", {
            sourcecurrency: toCurrency?.name,
          });
        }
        // Discard bad provider rates
        let rateError = null;
        rates = rates.reduce((acc, rate) => {
          rateError = rateError ?? rate.error;
          return rate.error ? acc : [...acc, rate];
        }, []);
        if (rates.length === 0 && rateError) {
          // If all the rates are in error
          dispatchRates({ type: "error", payload: rateError });
        } else {
          dispatchRates({ type: "set", payload: rates });
        }
      } catch (error) {
        !abort && dispatchRates({ type: "error", payload: error });
      }
    }

    getRates();

    return () => {
      abort = true;
      dispatchRates({ type: "idle" });
    };
  }, [
    fromAccount,
    fromParentAccount,
    toAccount,
    toParentAccount,
    transaction,
    toCurrency,
    getRatesDependency,
  ]);

  const toggleMax: $PropertyType<SwapTransactionType, "toggleMax"> = () =>
    setMax(previous => !previous);

  const reverseSwap: $PropertyType<SwapTransactionType, "reverseSwap"> = () => {
    if (isSwapReversable === false) return;

    const [newTo, newFrom] = [fromState, toState];
    setFromAccount(newFrom.account);
    setToAccount(newTo.currency, newTo.account, newTo.parentAccount);
  };

  const swap = {
    to: toState,
    from: fromState,
    isMaxEnabled,
    isSwapReversable,
    rates,
    refetchRates,
  };

  return {
    ...bridgeTransaction,
    swap,
    setFromAmount,
    toggleMax,
    fromAmountError,
    setToAccount,
    setFromAccount,
    setToAmount,
    reverseSwap,
  };
};

export default useSwapTransaction;
