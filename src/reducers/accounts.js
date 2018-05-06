// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import { createAccountModel } from '@ledgerhq/live-common/lib/models/account'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import type { Account } from '@ledgerhq/live-common/lib/types'

import type { State } from 'reducers'

export type AccountsState = Account[]
const state: AccountsState = []

const accountModel = createAccountModel()

function orderAccountsOperations(account: Account) {
  const { operations } = account
  operations.sort((a, b) => b.date - a.date)
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

export function accountsSelector(state: { accounts: AccountsState }): Account[] {
  return state.accounts
}

export const archivedAccountsSelector = createSelector(accountsSelector, accounts =>
  accounts.filter(acc => acc.archived),
)

export const visibleAccountsSelector = createSelector(accountsSelector, accounts =>
  accounts.filter(acc => !acc.archived),
)

export const currenciesSelector = createSelector(visibleAccountsSelector, accounts =>
  [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
)

export const accountSelector = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
)

// TODO remove deprecated selectors

export function getTotalBalance(state: { accounts: AccountsState }) {
  // TODO we will have it using utility functions
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

export function getAccountById(state: { accounts: AccountsState }, id: string): ?Account {
  return getAccounts(state).find(account => account.id === id)
}

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => get(a, 'operations.length', 0) > 0)
}

// Yeah. `any` should be `AccountRaw[]` but it can also be a map
// of wrapped accounts. And as flow is apparently incapable of doing
// such a simple thing, let's put any, right? I don't care.
export function serializeAccounts(accounts: any): Account[] {
  // ensure that accounts are always wrapped in data key
  if (accounts && accounts.length && !accounts[0].data) {
    accounts = accounts.map(account => ({ data: account }))
  }
  return accounts ? accounts.map(accountModel.decode) : []
}

export function deserializeAccounts(accounts: Account[]) {
  return accounts.map(account => {
    // as account can be passed by main process, the Date types
    // can be converted to string. we ensure here that we have real
    // date
    if (typeof account.lastSyncDate === 'string') {
      account.lastSyncDate = new Date(account.lastSyncDate)
    }

    return accountModel.encode(account)
  })
}

export default handleActions(handlers, state)
