// @flow
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account/helpers";
import type {
  Transaction,
  UPDATE_PROVIDERS_TYPE,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import memoize from "lodash/memoize";
import { createAction } from "redux-actions";
import type { OutputSelector } from "reselect";
import { createSelector } from "reselect";
import type { State } from "~/renderer/reducers";
import type { SwapStateType } from "~/renderer/reducers/swap";

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
export function sortAccountsByStatus(accounts: Account[]) {
  let activeAccounts = [];
  let disabledAccounts = [];
  let subAccounts = [];
  let disabledSubAccounts = [];

  // Traverse the accounts in reverse to check disabled accounts with active subAccounts
  for (let i = accounts.length - 1; i >= 0; i--) {
    const account = accounts[i];

    // Handle Account type first
    if (account.type === "Account") {
      if (account.disabled && !subAccounts.length) {
        // When a disabled account has no active subAccount, add it to the disabledAccounts
        disabledAccounts = [account, ...disabledSubAccounts, ...disabledAccounts];
      } else {
        // When an account has at least an active subAccount, add it to the activeAccounts
        activeAccounts = [account, ...subAccounts, ...disabledSubAccounts, ...activeAccounts];
      }

      // Clear subAccounts
      subAccounts = [];
      disabledSubAccounts = [];
    } else {
      // Add TokenAccount and ChildAccount to the subAccounts arrays
      if (account.disabled) {
        disabledSubAccounts.unshift(account);
      } else {
        subAccounts.unshift(account);
      }
    }
  }

  return [...activeAccounts, ...disabledAccounts];
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
