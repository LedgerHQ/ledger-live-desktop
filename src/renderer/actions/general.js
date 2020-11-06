// @flow

import type { BigNumber } from "bignumber.js";
import type { OutputSelector } from "reselect";
import { createSelector } from "reselect";
import type { Currency, AccountLikeArray, Account } from "@ledgerhq/live-common/lib/types";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from "@ledgerhq/live-common/lib/account";

import CounterValues from "../countervalues";
import {
  intermediaryCurrency,
  exchangeSettingsForPairSelector,
  getOrderAccounts,
  counterValueCurrencySelector,
  userThemeSelector,
} from "./../reducers/settings";
import { accountsSelector, activeAccountsSelector } from "./../reducers/accounts";
import type { State } from "./../reducers";
import { osDarkModeSelector } from "~/renderer/reducers/application";

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

export const flattenSortAccountsCompoundOnlySelector: OutputSelector<
  State,
  void,
  AccountLikeArray,
> = createSelector(flattenSortAccountsSelector, accounts =>
  accounts.filter(acc => (accounts.type === "TokenAccount" ? !!findCompoundToken(acc) : false)),
);

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
