// @flow

import { handleActions } from 'redux-actions'
import get from 'lodash/get'
import reduce from 'lodash/reduce'

import type { State } from 'reducers'
import type { Account, Accounts, AccountData } from 'types/common'

export type AccountsState = Accounts

const state: AccountsState = {}

const handlers: Object = {
  ADD_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) => ({
    ...state,
    [account.id]: {
      ...account,
    },
  }),
  FETCH_ACCOUNTS: (state: AccountsState, { payload: accounts }: { payload: Accounts }) => accounts,
  SET_ACCOUNT_DATA: (
    state: AccountsState,
    { payload: { accountID, data } }: { payload: { accountID: string, data: AccountData } },
  ): AccountsState => ({
    ...state,
    [accountID]: {
      ...state[accountID],
      data,
    },
  }),
}

// Selectors

export function getTotalBalance(state: { accounts: AccountsState }) {
  return reduce(
    state.accounts,
    (result, account) => {
      result += account.data.balance
      return result
    },
    0,
  )
}

export function getAccounts(state: { accounts: AccountsState }) {
  return state.accounts
}

export function getAccountById(state: { accounts: AccountsState }, id: string) {
  return getAccounts(state)[id]
}

export function getAccountData(state: State, id: string): AccountData | null {
  return get(getAccountById(state, id), 'data', null)
}

export default handleActions(handlers, state)
