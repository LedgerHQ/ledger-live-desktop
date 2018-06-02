// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import { createAccountModel } from '@ledgerhq/live-common/lib/models/account'

import type { Account, AccountRaw } from '@ledgerhq/live-common/lib/types'

export type AccountsState = Account[]
const state: AccountsState = []

const accountModel = createAccountModel()

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => {
    if (state.some(a => a.id === account.id)) {
      console.warn('ADD_ACCOUNT attempt for an account that already exists!', account.id)
      return state
    }
    return [...state, account]
  },

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { accountId, updater }: { accountId: string, updater: Account => Account },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== accountId) {
        return existingAccount
      }
      return updater(existingAccount)
    }),

  REMOVE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => state.filter(acc => acc.id !== account.id),
}

// Selectors

export function accountsSelector(state: { accounts: AccountsState }): Account[] {
  return state.accounts
}

export const currenciesSelector = createSelector(accountsSelector, accounts =>
  [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
)

export const accountSelector = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
)

export function decodeAccount(account: AccountRaw): Account {
  return accountModel.decode({
    data: account,
    version: accountModel.version,
  })
}

export function encodeAccount(account: Account): AccountRaw {
  return accountModel.encode(account).data
}

// Yeah. `any` should be `AccountRaw[]` but it can also be a map
// of wrapped accounts. And as flow is apparently incapable of doing
// such a simple thing, let's put any, right? I don't care.
// FIXME: no it shouldn't. the purpose of DataModel is to contain the version, it's the only way we can run the migration functions
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
    // FIXME Account shouldn't be passed by main process. only AccountRaw should be!
    if (typeof account.lastSyncDate === 'string') {
      account.lastSyncDate = new Date(account.lastSyncDate)
    }

    return accountModel.encode(account)
  })
}

export default handleActions(handlers, state)
