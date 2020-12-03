// @flow

import type { Account, SubAccount } from "@ledgerhq/live-common/lib/types";
import { implicitMigration } from "@ledgerhq/live-common/lib/migrations/accounts";
import { getKey } from "~/renderer/storage";

export const replaceAccounts = (payload: Account[]) => ({
  type: "DB:REPLACE_ACCOUNTS",
  payload,
});

export const addAccount = (payload: Account) => ({
  type: "DB:ADD_ACCOUNT",
  payload,
});

export const removeAccount = (payload: Account) => ({
  type: "DB:REMOVE_ACCOUNT",
  payload,
});

export const setAccounts = (payload: Account[]) => ({
  type: "SET_ACCOUNTS",
  payload,
});

export const fetchAccounts = () => async (dispatch: *) => {
  const accounts = implicitMigration(await getKey("app", "accounts", []));
  return dispatch({
    type: "SET_ACCOUNTS",
    payload: accounts,
  });
};

export type UpdateAccountWithUpdater = (accountId: string, (Account) => Account) => *;

export const updateAccountWithUpdater: UpdateAccountWithUpdater = (accountId, updater) => ({
  type: "DB:UPDATE_ACCOUNT",
  payload: { accountId, updater },
});

export type UpdateAccount = ($Shape<Account>) => *;
export const updateAccount: UpdateAccount = payload => ({
  type: "DB:UPDATE_ACCOUNT",
  payload: {
    updater: (account: Account) => ({ ...account, ...payload }),
    accountId: payload.id,
  },
});

export const toggleStarAction = (id: string, parentId: ?string) => {
  return {
    type: "DB:UPDATE_ACCOUNT",
    payload: {
      updater: (account: Account) => {
        if (parentId && account.subAccounts) {
          const subAccounts: SubAccount[] = account.subAccounts.map(sa =>
            sa.id === id
              ? // $FlowFixMe
                { ...sa, starred: !sa.starred }
              : sa,
          );
          return { ...account, subAccounts };
        }
        return { ...account, starred: !account.starred };
      },
      accountId: parentId || id,
    },
  };
};

export const cleanAccountsCache = () => ({ type: "DB:CLEAN_ACCOUNTS_CACHE" });
export const cleanFullNodeDisconnect = () => ({
  type: "DB:CLEAN_FULLNODE_DISCONNECT",
});
