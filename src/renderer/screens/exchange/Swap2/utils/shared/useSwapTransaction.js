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
import { pickExchangeRate } from "./index";
import { getAccountTuplesForCurrency } from "~/renderer/components/PerCurrencySelectAccount/state";

const ZERO = new BigNumber(0);

export type RatesReducerState = {
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
  targetAccounts: ?(Account[]),
};

const selectorStateDefaultValues = {
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
  setToCurrency: (currency: $PropertyType<SwapSelectorStateType, "currency">) => void,
  toggleMax: () => void,
  reverseSwap: () => void,
};

const useSwapTransaction = ({
  accounts,
  exchangeRate,
  setExchangeRate,
  defaultCurrency,
  defaultAccount,
  defaultParentAccount,
  onNoRates,
}: {
  accounts: ?(Account[]),
  exchangeRate: ?ExchangeRate,
  setExchangeRate: (?ExchangeRate) => void,
  defaultCurrency?: $PropertyType<SwapSelectorStateType, "currency">,
  defaultAccount?: $PropertyType<SwapSelectorStateType, "account">,
  defaultParentAccount?: $PropertyType<SwapSelectorStateType, "parentAccount">,
  onNoRates?: ({ fromState: SwapSelectorStateType, toState: SwapSelectorStateType }) => void,
} = {}): SwapTransactionType => {
  const [toState, setToState] = useState<SwapSelectorStateType>(selectorStateDefaultValues);
  const [fromState, setFromState] = useState<SwapSelectorStateType>({
    ...selectorStateDefaultValues,
    currency: defaultCurrency ?? selectorStateDefaultValues.currency,
    account: defaultAccount ?? selectorStateDefaultValues.account,
    parentAccount: defaultParentAccount ?? selectorStateDefaultValues.parentAccount,
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
  const { account: fromAccount, parentAccount: fromParentAccount, amount: fromAmount } = fromState;
  const { account: toAccount, parentAccount: toParentAccount, currency: toCurrency } = toState;
  const transaction = bridgeTransaction?.transaction;
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
  const setFromAccount: $PropertyType<SwapTransactionType, "setFromAccount"> = useCallback(
    account => {
      const parentAccount =
        account?.type !== "Account" ? allAccounts.find(a => a.id === account?.parentId) : null;
      const currency = getAccountCurrency(account);

      bridgeTransaction.setAccount(account, parentAccount);
      setFromState({ ...selectorStateDefaultValues, currency, account, parentAccount });

      /* @DEV: That populates fake seed. This is required to use Transaction object */
      const mainAccount = getMainAccount(account, parentAccount);
      const mainCurrency = getAccountCurrency(mainAccount);
      const recipient = getAbandonSeedAddress(mainCurrency.id);
      bridgeTransaction.updateTransaction(transaction => ({ ...transaction, recipient }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allAccounts, bridgeTransaction.updateTransaction],
  );

  /* UPDATE to accounts */
  const setToAccount: $PropertyType<SwapTransactionType, "setToAccount"> = useCallback(
    (currency, account, parentAccount) =>
      setToState({ ...selectorStateDefaultValues, currency, account, parentAccount }),
    [],
  );

  /* Get the list of possible target accounts given the target currency. */
  const getTargetAccountsPairs = useCallback(
    currency => currency && accounts && getAccountTuplesForCurrency(currency, accounts, false),
    [accounts],
  );
  const targetAccounts = useMemo(
    () =>
      getTargetAccountsPairs(toCurrency)?.map(({ account, subAccount }) => subAccount || account),
    [toCurrency, getTargetAccountsPairs],
  );

  const setToCurrency: $PropertyType<SwapTransactionType, "setToCurrency"> = useCallback(
    currency => {
      const targetAccountsPairs = getTargetAccountsPairs(currency);
      const accountPair = targetAccountsPairs && targetAccountsPairs[0];
      const account = accountPair && (accountPair.subAccount || accountPair.account);
      const parentAccount = accountPair && accountPair.subAccount && accountPair.account;

      setToState({
        ...selectorStateDefaultValues,
        currency,
        account,
        parentAccount,
      });
    },
    [getTargetAccountsPairs],
  );

  const setFromAmount: $PropertyType<SwapTransactionType, "setFromAmount"> = useCallback(
    amount => {
      bridgeTransaction.updateTransaction(transaction => ({ ...transaction, amount }));
      setFromState(previousState => ({ ...previousState, amount: amount }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bridgeTransaction.updateTransaction],
  );

  const setToAmount: $PropertyType<SwapTransactionType, "setToAmount"> = useCallback(
    amount => setToState(previousState => ({ ...previousState, amount: amount })),
    [],
  );

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

    if (isMaxEnabled) {
      updateAmountUsingMax();
    }
  }, [
    setFromAmount,
    isMaxEnabled,
    fromState.account,
    bridgeTransaction?.transaction?.feesStrategy,
  ]);

  /* Fetch and update provider rates. */
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
        setExchangeRate && setExchangeRate(null);
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
          onNoRates && onNoRates({ fromState, toState });
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
          setExchangeRate && pickExchangeRate(rates, exchangeRate, setExchangeRate);
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
  }, [fromAccount, fromAmount, toAccount, transaction, getRatesDependency, onNoRates]);

  const toggleMax: $PropertyType<SwapTransactionType, "toggleMax"> = useCallback(
    () =>
      setMax(previous => {
        if (previous) {
          setFromAmount(ZERO);
        }
        return !previous;
      }),
    [setFromAmount],
  );

  const reverseSwap: $PropertyType<SwapTransactionType, "reverseSwap"> = useCallback(() => {
    if (isSwapReversable === false) return;

    const [newTo, newFrom] = [fromState, toState];
    setFromAccount(newFrom.account);
    setToAccount(newTo.currency, newTo.account, newTo.parentAccount);
  }, [fromState, toState, setFromAccount, setToAccount, isSwapReversable]);

  const swap = {
    to: toState,
    from: fromState,
    isMaxEnabled,
    isSwapReversable,
    rates,
    refetchRates,
    targetAccounts,
  };

  return {
    ...bridgeTransaction,
    swap,
    setFromAmount,
    toggleMax,
    fromAmountError,
    setToAccount,
    setToCurrency,
    setFromAccount,
    setToAmount,
    reverseSwap,
  };
};

export default useSwapTransaction;
