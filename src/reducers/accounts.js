// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import accountModel from 'helpers/accountModel'
import logger from 'logger'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { flattenAccounts, clearAccount } from '@ledgerhq/live-common/lib/account'
import { OUTDATED_CONSIDERED_DELAY, DEBUG_SYNC } from 'config/constants'
import { currenciesStatusSelector, currencyDownStatusLocal } from './currenciesStatus'

export type AccountsState = Account[]
const state: AccountsState = []

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
      logger.warn('ADD_ACCOUNT attempt for an account that already exists!', account.id)
      return state
    }
    return [...state, account]
  },

  REPLACE_ACCOUNTS: (state: AccountsState, { payload }: { payload: Account[] }) => payload,

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

  CLEAN_ACCOUNTS_CACHE: (state: AccountsState): AccountsState => state.map(clearAccount),

  // used to debug performance of redux updates
  DEBUG_TICK: state => state.slice(0),
}

// Selectors

export const accountsSelector = (state: { accounts: AccountsState }): Account[] => state.accounts

export const activeAccountsSelector = createSelector(
  accountsSelector,
  currenciesStatusSelector,
  (accounts, currenciesStatus) =>
    accounts.filter(a => !currencyDownStatusLocal(currenciesStatus, a.currency)),
)

export const isUpToDateSelector = createSelector(
  activeAccountsSelector,
  accounts =>
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

export const hasAccountsSelector = createSelector(
  accountsSelector,
  accounts => accounts.length > 0,
)

export const currenciesSelector = createSelector(
  accountsSelector,
  accounts =>
    [
      ...new Set(flattenAccounts(accounts).map(a => (a.type === 'Account' ? a.currency : a.token))),
    ].sort((a, b) => a.name.localeCompare(b.name)),
)

export const cryptoCurrenciesSelector = createSelector(
  accountsSelector,
  accounts =>
    [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
)

export const accountSelector = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
)

const isUpToDateAccount = a => {
  const { lastSyncDate } = a
  const { blockAvgTime } = a.currency
  if (!blockAvgTime) return true
  const outdated =
    Date.now() - (lastSyncDate || 0) > blockAvgTime * 1000 + OUTDATED_CONSIDERED_DELAY
  if (outdated && DEBUG_SYNC) {
    logger.log('account not up to date', a)
  }
  return !outdated
}

export const isUpToDateAccountSelector = createSelector(
  accountSelector,
  isUpToDateAccount,
)
export const decodeAccountsModel = (raws: *) => (raws || []).map(accountModel.decode)

export const encodeAccountsModel = (accounts: *) => (accounts || []).map(accountModel.encode)

export default handleActions(handlers, state)
