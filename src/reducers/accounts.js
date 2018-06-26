// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import { createAccountModel } from '@ledgerhq/live-common/lib/models/account'
import logger from 'logger'
import type { Account, AccountRaw } from '@ledgerhq/live-common/lib/types'
import { OUTDATED_CONSIDERED_DELAY, DEBUG_SYNC } from 'config/constants'

export type AccountsState = Account[]
const state: AccountsState = []

const accountModel = createAccountModel()

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts,

  REORDER_ACCOUNTS: (state: AccountsState, { payload }: { payload: string[] }) =>
    state.slice(0).sort((a, b) => payload.indexOf(a.id) - payload.indexOf(b.id)),

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => {
    if (state.some(a => a.id === account.id)) {
      logger.warn('ADD_ACCOUNT attempt for an account that already exists!', account.id)
      return state
    }
    return [...state, account]
  },

  UPDATE_ACCOUNT: (
    state: AccountsState,
    {
      payload: { accountId, updater },
    }: { payload: { accountId: string, updater: Account => Account } },
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

  CLEAN_ACCOUNTS_CACHE: (state: AccountsState): AccountsState =>
    state.map(acc => ({
      ...acc,
      operations: [],
      pendingOperations: [],
    })),
}

// Selectors

export const accountsSelector = (state: { accounts: AccountsState }): Account[] => state.accounts

export const isUpToDateSelector = createSelector(accountsSelector, accounts =>
  accounts.every(a => {
    const { lastSyncDate } = a
    const { blockAvgTime } = a.currency
    if (!blockAvgTime) return true
    const outdated =
      Date.now() - (lastSyncDate || 0) > blockAvgTime * 1000 + OUTDATED_CONSIDERED_DELAY
    if (outdated && DEBUG_SYNC) {
      logger.log('account not up to date', a)
    }
    return !outdated
  }),
)

export const hasAccountsSelector = createSelector(accountsSelector, accounts => accounts.length > 0)

export const currenciesSelector = createSelector(accountsSelector, accounts =>
  [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
)

export const accountSelector = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
)

export const decodeAccount = (account: AccountRaw): Account =>
  accountModel.decode({
    data: account,
    version: accountModel.version,
  })

export const encodeAccount = (account: Account): AccountRaw => accountModel.encode(account).data

export const decodeAccountsModel = (raws: *) => (raws || []).map(accountModel.decode)

export const encodeAccountsModel = (accounts: *) => (accounts || []).map(accountModel.encode)

export default handleActions(handlers, state)
