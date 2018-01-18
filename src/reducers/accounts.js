// @flow

import { handleActions } from 'redux-actions'
import shortid from 'shortid'

import type { Account, Accounts } from 'types/common'

export type AccountsState = {
  accounts: Accounts,
}

const state: AccountsState = {
  accounts: {},
}

const handlers: Object = {
  ADD_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) => {
    const id = shortid.generate()

    return {
      ...state,
      accounts: {
        ...state.accounts,
        [id]: {
          id,
          ...account,
        },
      },
    }
  },
  FETCH_ACCOUNTS: (state: AccountsState, { payload: accounts }: { payload: Accounts }) => ({
    ...state,
    accounts,
  }),
}

export function getAccounts(state: { accounts: AccountsState }) {
  return state.accounts.accounts
}

export function getAccountById(state: { accounts: AccountsState }, id: string) {
  return getAccounts(state)[id]
}

export default handleActions(handlers, state)
