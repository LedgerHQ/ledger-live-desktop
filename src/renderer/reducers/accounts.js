// @flow

import { createSelector } from "reselect";
import type { OutputSelector } from "reselect";
import { handleActions } from "redux-actions";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  flattenAccounts,
  clearAccount,
  canBeMigrated,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import logger from "./../../logger/logger";
import accountModel from "./../../helpers/accountModel";
import { currenciesStatusSelector, currencyDownStatusLocal } from "./currenciesStatus";
import type { State } from ".";

export type AccountsState = Account[];
const state: AccountsState = [];

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => {
    if (state.some(a => a.id === account.id)) {
      logger.warn("ADD_ACCOUNT attempt for an account that already exists!", account.id);
      return state;
    }
    return [...state, account];
  },

  REPLACE_ACCOUNTS: (state: AccountsState, { payload }: { payload: Account[] }) => payload,

  UPDATE_ACCOUNT: (
    state: AccountsState,
    {
      payload: { accountId, updater },
    }: { payload: { accountId: string, updater: Account => Account } },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== accountId) {
        return existingAccount;
      }
      return updater(existingAccount);
    }),

  REMOVE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => state.filter(acc => acc.id !== account.id),

  CLEAN_ACCOUNTS_CACHE: (state: AccountsState): AccountsState => state.map(clearAccount),

  // used to debug performance of redux updates
  DEBUG_TICK: state => state.slice(0),
};

// Selectors

export const accountsSelector = (state: { accounts: AccountsState }): Account[] => state.accounts;

export const activeAccountsSelector: OutputSelector<
  State,
  void,
  Account[],
> = createSelector(accountsSelector, currenciesStatusSelector, (accounts, currenciesStatus) =>
  accounts.filter(a => !currencyDownStatusLocal(currenciesStatus, a.currency)),
);

export const isUpToDateSelector: OutputSelector<State, void, boolean> = createSelector(
  activeAccountsSelector,
  accounts =>
    accounts.every(a => {
      const { lastSyncDate } = a;
      const { blockAvgTime } = a.currency;
      if (!blockAvgTime) return true;
      const outdated =
        Date.now() - (lastSyncDate || 0) >
        blockAvgTime * 1000 + getEnv("SYNC_OUTDATED_CONSIDERED_DELAY");
      return !outdated;
    }),
);

export const hasAccountsSelector: OutputSelector<State, void, boolean> = createSelector(
  accountsSelector,
  accounts => accounts.length > 0,
);

export const someAccountsNeedMigrationSelector: OutputSelector<
  State,
  void,
  boolean,
> = createSelector(accountsSelector, accounts => accounts.some(canBeMigrated));

// TODO: FIX RETURN TYPE
export const currenciesSelector: OutputSelector<State, void, *> = createSelector(
  accountsSelector,
  accounts =>
    [...new Set(flattenAccounts(accounts).map(a => getAccountCurrency(a)))].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
);

// TODO: FIX RETURN TYPE
export const cryptoCurrenciesSelector: OutputSelector<
  State,
  void,
  *,
> = createSelector(accountsSelector, accounts =>
  [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
);

export const accountSelector: OutputSelector<
  State,
  { accountId: string },
  ?Account,
> = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
);

export const migratableAccountsSelector = (s: *): Account[] => s.accounts.filter(canBeMigrated);

export const starredAccountsSelector: OutputSelector<
  State,
  void,
  AccountLike[],
> = createSelector(accountsSelector, accounts => flattenAccounts(accounts).filter(a => a.starred));

export const isStarredAccountSelector = (s: *, { accountId }: { accountId: string }): boolean =>
  flattenAccounts(s.accounts).some(a => a.id === accountId && a.starred);

export const accountNeedsMigrationSelector: OutputSelector<
  State,
  { accountId: string },
  boolean,
> = createSelector(accountSelector, account => (account ? canBeMigrated(account) : false));

const isUpToDateAccount = (a: ?Account) => {
  if (!a) return true;
  const { lastSyncDate } = a;
  const { blockAvgTime } = a.currency;
  if (!blockAvgTime) return true;
  const outdated =
    Date.now() - (lastSyncDate || 0) >
    blockAvgTime * 1000 + getEnv("SYNC_OUTDATED_CONSIDERED_DELAY");
  return !outdated;
};

export const isUpToDateAccountSelector: OutputSelector<
  State,
  { accountId: string },
  boolean,
> = createSelector(accountSelector, isUpToDateAccount);

export const decodeAccountsModel = (raws: *) => (raws || []).map(accountModel.decode);

export const encodeAccountsModel = (accounts: *) => (accounts || []).map(accountModel.encode);

export default handleActions(handlers, state);
