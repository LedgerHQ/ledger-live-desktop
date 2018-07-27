// @flow

import type { Account } from '@ledgerhq/live-common/lib/types'

import db from 'helpers/db'

export type AddAccount = Account => *
export const addAccount: AddAccount = payload => ({
  type: 'DB:ADD_ACCOUNT',
  payload,
})

export type RemoveAccount = Account => { type: string, payload: Account }
export const removeAccount: RemoveAccount = payload => ({
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
