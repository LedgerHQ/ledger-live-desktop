// @flow

import { handleActions } from 'redux-actions'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import uniqBy from 'lodash/uniqBy'

import type { State } from 'reducers'
import type { Account, Accounts, AccountData } from 'types/common'

export type AccountsState = Accounts

const state: AccountsState = {}

function getAccount(account: Account) {
  const transactions = get(account.data, 'transactions', [])

  transactions.sort((a, b) => new Date(b.received_at) - new Date(a.received_at))

  return {
    ...account,
    data: {
      ...(account.data || {}),
      transactions,
    },
  }
}

const handlers: Object = {
  ADD_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) => ({
    ...state,
    [account.id]: getAccount(account),
  }),
  FETCH_ACCOUNTS: (state: AccountsState, { payload: accounts }: { payload: Accounts }) => accounts,
  SET_ACCOUNT_DATA: (
    state: AccountsState,
    { payload: { accountID, data } }: { payload: { accountID: string, data: AccountData } },
  ): AccountsState => {
    const account = state[accountID]
    const { data: accountData } = account

    const transactions = uniqBy(
      [...get(accountData, 'transactions', []), ...data.transactions],
      tx => tx.hash,
    )
    const currentIndex = data.currentIndex ? data.currentIndex : get(accountData, 'currentIndex', 0)

    account.data = {
      ...accountData,
      ...data,
      balance: transactions.reduce((result, v) => {
        result += v.balance
        return result
      }, 0),
      currentIndex,
      transactions,
    }

    return {
      ...state,
      [accountID]: getAccount(account),
    }
  },
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
  return Object.keys(state.accounts).reduce((result, key) => {
    result[key] = getAccount(state.accounts[key])
    return result
  }, {})
}

export function getAccountById(state: { accounts: AccountsState }, id: string) {
  return getAccounts(state)[id]
}

export function getAccountData(state: State, id: string): AccountData | null {
  return get(getAccountById(state, id), 'data', null)
}

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => a.data.transactions.length > 0)
}

export default handleActions(handlers, state)
