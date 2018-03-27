// @flow

import { handleActions } from 'redux-actions'
import { createAccountModel } from '@ledgerhq/wallet-common/lib/models/account'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import type { Account, AccountRaw } from '@ledgerhq/wallet-common/lib/types'

import type { State } from 'reducers'

export type AccountsState = Account[]
const state: AccountsState = []

const accountModel = createAccountModel()

function orderAccountsOperations(account: Account) {
  const { operations } = account
  operations.sort((a, b) => new Date(b.date) - new Date(a.date))
  return {
    ...account,
    operations,
  }
}

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => [...state, orderAccountsOperations(account)],

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== account.id) {
        return existingAccount
      }

      const updatedAccount = {
        ...existingAccount,
        ...account,
      }

      return orderAccountsOperations(updatedAccount)
    }),

  REMOVE_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) =>
    state.filter(acc => acc.id !== account.id),
}

// Selectors

export function getTotalBalance(state: { accounts: AccountsState }) {
  return reduce(
    state.accounts,
    (result, account) => {
      result += get(account, 'balance', 0)
      return result
    },
    0,
  )
}

export function getAccounts(state: { accounts: AccountsState }): Account[] {
  return state.accounts
}

export function getArchivedAccounts(state: { accounts: AccountsState }): Account[] {
  return state.accounts.filter(acc => acc.archived === true)
}

export function getVisibleAccounts(state: { accounts: AccountsState }): Account[] {
  return getAccounts(state).filter(account => account.archived !== true)
}

export function getAccountById(state: { accounts: AccountsState }, id: string): Account | null {
  const account = getAccounts(state).find(account => account.id === id)
  return account || null
}

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => get(a, 'operations.length', 0) > 0)
}

export function serializeAccounts(accounts: Account[]) {
  return accounts.map(accountModel.decode)
}

export function deserializeAccounts(accounts: AccountRaw[]) {
  return accounts.map(accountModel.encode)
}

export default handleActions(handlers, state)
