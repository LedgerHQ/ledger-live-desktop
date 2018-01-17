// @flow

import { handleActions } from 'redux-actions'

import type { Account, Accounts } from 'types/common'

export type AccountsState = {
  accounts: Accounts,
}

const state: AccountsState = {
  accounts: [],
}

const handlers: Object = {
  ADD_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) => ({
    ...state,
    accounts: [...state.accounts, account],
  }),
  FETCH_ACCOUNTS: (state: AccountsState, { payload: accounts }: { payload: Accounts }) => ({
    ...state,
    accounts,
  }),
}

export function getAccounts(state: { accounts: AccountsState }) {
  return state.accounts.accounts
}

export default handleActions(handlers, state)
