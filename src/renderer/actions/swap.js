// @flow
import { createAction } from "redux-actions";
import { createSelector } from "reselect";
import type { OutputSelector } from "reselect";
import type { State } from "~/renderer/reducers";
import type { SwapStateType, UPDATE_PROVIDERS_TYPE } from "~/renderer/reducers/swap";
import type { Transaction } from "@ledgerhq/live-common/lib/exchange/swap/types";
import memoize from "lodash/memoize";

import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account/helpers";

/* ACTIONS */
export const updateProvidersAction = createAction<$PropertyType<UPDATE_PROVIDERS_TYPE, "payload">>(
  "SWAP/UPDATE_PROVIDERS",
);

export const updateTransactionAction = createAction<$PropertyType<?Transaction, "payload">>(
  "SWAP/UPDATE_TRANSACTION",
);
export const updateRateAction = createAction<$PropertyType<?Transaction, "exchangeRate">>(
  "SWAP/UPDATE_RATE",
);

export const resetSwapAction = createAction("SWAP/RESET_STATE");

/* SELECTORS */
export const providersSelector: OutputSelector<
  State,
  void,
  $PropertyType<SwapStateType, "providers">,
> = createSelector(
  state => state.swap,
  swap => swap.providers,
);

const filterAvailableToAssets = (pairs, fromId?: string) => {
  if (pairs === null || pairs === undefined) return null;

  if (fromId)
    return pairs.reduce((acc, pair) => (pair.from === fromId ? [...acc, pair.to] : acc), []);

  return pairs.reduce((acc, pair) => [...acc, pair.to], []);
};

const filterAvailableFromAssets = (pairs, allAccounts) => {
  if (pairs === null || pairs === undefined) return [];

  return flattenAccounts(allAccounts).map(account => {
    const id = getAccountCurrency(account).id;
    const isAccountAvailable = !!pairs.find(pair => pair.from === id);
    return { ...account, disabled: !isAccountAvailable };
  });
};

export const toSelector: OutputSelector<State, void, *> = createSelector(
  state => state.swap.pairs,
  pairs =>
    memoize((fromId?: "string") => {
      const filteredAssets = filterAvailableToAssets(pairs, fromId);
      const uniqueAssetList = [...new Set(filteredAssets)];
      return uniqueAssetList;
    }),
);

// Put disabled accounts and subaccounts at the bottom of the list while preserving the parent/children position.
function sortAccountsByStatus(accounts) {
  const [top, bottom, childrenStack] = accounts.reduce(
    ([enabled, disabled, childrenStack], account) => {
      if (account.type === "Account") {
        if (account.disabled) {
          return [[...enabled, ...childrenStack], [...disabled, account], []];
        }
        return [[...enabled, ...childrenStack, account], disabled, []];
      }
      if (account.disabled) {
        return [enabled, disabled, [...childrenStack, account]];
      }
      return [[...enabled, account], disabled, childrenStack];
    },
    [[], [], []],
  );
  return [...top, ...bottom, ...childrenStack];
}

export const fromSelector: OutputSelector<State, void, *> = createSelector(
  state => state.swap.pairs,
  pairs =>
    memoize((allAccounts: Array<Account>): Array<Account | TokenAccount> =>
      sortAccountsByStatus(filterAvailableFromAssets(pairs, allAccounts)),
    ),
);

export const transactionSelector: OutputSelector<
  State,
  void,
  $PropertyType<SwapStateType, "transaction">,
> = createSelector(
  state => state.swap,
  swap => swap.transaction,
);

export const rateSelector: OutputSelector<
  State,
  void,
  $PropertyType<SwapStateType, "exchangeRate">,
> = createSelector(
  state => state.swap,
  swap => swap.exchangeRate,
);

export const rateExpirationSelector: OutputSelector<
  State,
  void,
  $PropertyType<SwapStateType, "exchangeRateExpiration">,
> = createSelector(
  state => state.swap,
  swap => swap.exchangeRateExpiration,
);
