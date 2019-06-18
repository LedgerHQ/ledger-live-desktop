// @flow

import type { Account } from '@ledgerhq/live-common/lib/types'

import db from 'helpers/db'

export const replaceAccounts = (payload: Account[]) => ({
  type: 'DB:REPLACE_ACCOUNTS',
  payload,
})

export const addAccount = (payload: Account) => ({
  type: 'DB:ADD_ACCOUNT',
  payload,
})

export const removeAccount = (payload: Account) => ({
  type: 'DB:REMOVE_ACCOUNT',
  payload,
})

export const fetchAccounts = () => async (dispatch: *) => {
  const accounts = await db.getKey('app', 'accounts', [])
  return dispatch({
    type: 'SET_ACCOUNTS',
    payload: accounts,
  })
}

export type UpdateAccountWithUpdater = (accountId: string, (Account) => Account) => *

export const updateAccountWithUpdater: UpdateAccountWithUpdater = (accountId, updater) => ({
  type: 'DB:UPDATE_ACCOUNT',
  payload: { accountId, updater },
})

export type UpdateAccount = ($Shape<Account>) => *
export const updateAccount: UpdateAccount = payload => ({
  type: 'DB:UPDATE_ACCOUNT',
  payload: {
    updater: (account: Account) => ({ ...account, ...payload }),
    accountId: payload.id,
  },
})

export const cleanAccountsCache = () => ({ type: 'DB:CLEAN_ACCOUNTS_CACHE' })
