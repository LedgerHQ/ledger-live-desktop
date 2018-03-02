// @flow

import { handleActions } from 'redux-actions'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import defaultsDeep from 'lodash/defaultsDeep'

import { getDefaultUnitByCoinType, getCurrencyByCoinType } from '@ledgerhq/currencies'

import type { State } from 'reducers'
import type { Account, Accounts } from 'types/common'

export type AccountsState = Accounts

const state: AccountsState = []

function orderAccountsTransactions(account: Account) {
  const { transactions } = account
  transactions.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  return {
    ...account,
    transactions,
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
    { payload: accounts }: { payload: Accounts },
  ): AccountsState => accounts.map(applyDefaults),

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => [...state, orderAccountsTransactions(account)],

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== account.id) {
        return existingAccount
      }

      const { transactions, index } = account

      const updatedAccount = {
        ...existingAccount,
        ...account,
        balance: transactions.reduce((result, v) => {
          result += v.balance
          return result
        }, 0),
        index: index || get(existingAccount, 'currentIndex', 0),
        transactions,
      }

      return orderAccountsTransactions(updatedAccount)
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

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => get(a, 'transactions.length', 0) > 0)
}

export function serializeAccounts(accounts: Array<Object>) {
  return accounts.map((account, key) => {
    const a = {
      id: account.id,
      address: account.address,
      addresses: account.addresses,
      balance: account.balance,
      coinType: account.coinType,
      currency: getCurrencyByCoinType(account.coinType),
      index: account.index,
      name: account.name || `${key}`,
      path: account.path,
      unit: account.unit || getDefaultUnitByCoinType(account.coinType),
      settings: account.settings,
    }

    return {
      ...a,
      transactions: account.transactions.map(t => ({
        ...t,
        account: a,
      })),
    }
  })
}

export function deserializeAccounts(accounts: Accounts) {
  return accounts.map(account => ({
    id: account.id,
    address: account.address,
    addresses: account.addresses,
    balance: account.balance,
    coinType: account.coinType,
    index: account.index,
    name: account.name,
    path: account.path,
    transactions: account.transactions.map(({ account, ...t }) => t),
    unit: account.unit,
    settings: account.settings,
  }))
}

export default handleActions(handlers, state)
