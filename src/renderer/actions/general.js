// @flow
import { BigNumber } from "bignumber.js";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { OutputSelector } from "reselect";
import { createSelector } from "reselect";
import type { Currency, AccountLikeArray, Account } from "@ledgerhq/live-common/lib/types";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from "@ledgerhq/live-common/lib/account";
import { getAssetsDistribution } from "@ledgerhq/live-common/lib/portfolio";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { calculate } from "@ledgerhq/live-common/lib/countervalues/logic";
import CounterValues from "../countervalues";
import type { State } from "~/renderer/reducers";
import { accountsSelector, activeAccountsSelector } from "~/renderer/reducers/accounts";
import { osDarkModeSelector } from "~/renderer/reducers/application";
import {
  intermediaryCurrency,
  exchangeSettingsForPairSelector,
  getOrderAccounts,
  counterValueCurrencySelector,
  userThemeSelector,
} from "~/renderer/reducers/settings";

export function useDistribution() {
  const accounts = useSelector(accountsSelector);
  const to = useSelector(counterValueCurrencySelector);
  const state = useCountervaluesState();

  return useMemo(() => {
    function calc(from: Currency, value: number): ?BigNumber {
      const countervalue = calculate(state, {
        value,
        from,
        to,
        disableRounding: true,
      });
      return typeof countervalue !== "undefined" ? BigNumber(countervalue) : countervalue;
    }

    return getAssetsDistribution(accounts, calc, {
      minShowFirst: 6,
      maxShowFirst: 6,
      showFirstThreshold: 0.95,
    });
  }, [accounts, state, to]);
}

export const calculateCountervalueSelector = (state: State) => {
  const counterValueCurrency = counterValueCurrencySelector(state);
  return (currency: Currency, value: BigNumber): ?BigNumber => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency);
    const fromExchange = exchangeSettingsForPairSelector(state, {
      from: currency,
      to: intermediary,
    });
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    });
    return CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    });
  };
};

export const sortAccountsComparatorSelector: OutputSelector<State, void, *> = createSelector(
  getOrderAccounts,
  calculateCountervalueSelector,
  sortAccountsComparatorFromOrder,
);

const nestedSortAccountsSelector = createSelector(
  accountsSelector,
  sortAccountsComparatorSelector,
  nestedSortAccounts,
);

export const flattenSortAccountsSelector: OutputSelector<
  State,
  void,
  AccountLikeArray,
> = createSelector(accountsSelector, sortAccountsComparatorSelector, flattenSortAccounts);

export const flattenSortAccountsEnforceHideEmptyTokenSelector: OutputSelector<
  State,
  void,
  AccountLikeArray,
> = createSelector(accountsSelector, sortAccountsComparatorSelector, (accounts, comparator) =>
  flattenSortAccounts(accounts, comparator, { enforceHideEmptySubAccounts: true }),
);

export const haveUndelegatedAccountsSelector: OutputSelector<
  State,
  void,
  boolean,
> = createSelector(flattenSortAccountsEnforceHideEmptyTokenSelector, accounts =>
  accounts.some(
    acc => acc.currency && acc.currency.family === "tezos" && !isAccountDelegating(acc),
  ),
);

export const delegatableAccountsSelector: OutputSelector<
  State,
  void,
  Account[],
> = createSelector(activeAccountsSelector, accounts =>
  accounts.filter(acc => acc.currency.family === "tezos" && !isAccountDelegating(acc)),
);

export const refreshAccountsOrdering = () => (dispatch: *, getState: *) => {
  dispatch({
    type: "DB:SET_ACCOUNTS",
    payload: nestedSortAccountsSelector(getState()),
  });
};

export const themeSelector: OutputSelector<State, void, string> = createSelector(
  osDarkModeSelector,
  userThemeSelector,
  (osDark, theme) => theme || (osDark ? "dark" : "light"),
);
