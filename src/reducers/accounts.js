// @flow

import { handleActions } from 'redux-actions'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import uniqBy from 'lodash/uniqBy'

import type { State } from 'reducers'
import type { Account, Accounts, AccountData } from 'types/common'

export type AccountsState = Accounts

const state: AccountsState = []

function orderAccountsTransactions(account: Account) {
  const transactions = get(account.data, 'transactions', [])
  transactions.sort((a, b) => new Date(b.received_at) - new Date(a.received_at))
  return {
    ...account,
    data: {
      ...account.data,
      transactions,
    },
  }
}

const defaultAccountData: AccountData = {
  address: '',
  balance: 0,
  currentIndex: 0,
  transactions: [],
}

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Accounts },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => {
    account = orderAccountsTransactions({
      ...account,
      data: {
        ...defaultAccountData,
        ...account.data,
      },
    })
    return [...state, account]
  },

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== account.id) {
        return existingAccount
      }

      const existingData = get(existingAccount, 'data', {})
      const data = get(account, 'data', {})

      const transactions = uniqBy(
        [...get(existingData, 'transactions', []), ...get(data, 'transactions', [])],
        tx => tx.hash,
      )

      const currentIndex = data.currentIndex
        ? data.currentIndex
        : get(existingData, 'currentIndex', 0)

      const updatedAccount = {
        ...existingAccount,
        ...account,
        data: {
          ...existingData,
          ...data,
          balance: transactions.reduce((result, v) => {
            result += v.balance
            return result
          }, 0),
          currentIndex,
          transactions,
        },
      }

      return orderAccountsTransactions(updatedAccount)
    }),
}

// Selectors

export function getTotalBalance(state: { accounts: AccountsState }) {
  return reduce(
    state.accounts,
    (result, account) => {
      result += get(account, 'data.balance', 0)
      return result
    },
    0,
  )
}

export function getAccounts(state: { accounts: AccountsState }): Array<Account> {
  return state.accounts
}

export function getArchivedAccounts(state: { accounts: AccountsState }): Array<Account> {
  return state.accounts.filter(acc => acc.archived === true)
}

export function getVisibleAccounts(state: { accounts: AccountsState }): Array<Account> {
  return getAccounts(state).filter(account => account.archived !== true)
}

export function getAccountById(state: { accounts: AccountsState }, id: string): Account | null {
  const account = getAccounts(state).find(account => account.id === id)
  return account || null
}

export function getAccountData(state: State, id: string): AccountData | null {
  return get(getAccountById(state, id), 'data', null)
}

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => get(a, 'data.transactions.length', 0) > 0)
}

export default handleActions(handlers, state)
