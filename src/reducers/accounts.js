// @flow

import { handleActions } from 'redux-actions'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import defaultsDeep from 'lodash/defaultsDeep'

import { getDefaultUnitByCoinType, getCurrencyByCoinType } from '@ledgerhq/currencies'

import type { State } from 'reducers'
import type { Account } from 'types/common'

export type AccountsState = Account[]
const state: AccountsState = []

function orderAccountsOperations(account: Account) {
  const { operations } = account
  operations.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  return {
    ...account,
    operations,
  }
}

function applyDefaults(account) {
  return defaultsDeep(account, {
    settings: {
      minConfirmations: 2,
    },
  })
}

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts.map(applyDefaults),

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

export function serializeAccounts(accounts: Array<Object>) {
  return accounts.map((account, key) => ({
    ...account,
    currency: getCurrencyByCoinType(account.coinType),
    name: account.name || `${key}`,
    unit: account.unit || getDefaultUnitByCoinType(account.coinType),
  }))
}

export function deserializeAccounts(accounts: Account[]) {
  return accounts.map(account => ({
    id: account.id,
    address: account.address,
    addresses: account.addresses,
    balance: account.balance,
    balanceByDay: account.balanceByDay,
    coinType: account.coinType,
    index: account.index,
    name: account.name,
    operations: account.operations,
    path: account.path,
    rootPath: account.rootPath,
    settings: account.settings,
    unit: account.unit,
  }))
}

export default handleActions(handlers, state)
