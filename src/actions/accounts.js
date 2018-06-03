// @flow

import sortBy from 'lodash/sortBy'
import type { Account } from '@ledgerhq/live-common/lib/types'

import db from 'helpers/db'

import type { Dispatch } from 'redux'

function sortAccounts(accounts, orderAccounts) {
  const [order, sort] = orderAccounts.split('|')

  const accountsSorted = sortBy(accounts, a => {
    if (order === 'balance') {
      return a.balance
    }

    return a[order]
  })

  if (sort === 'asc') {
    accountsSorted.reverse()
  }

  return accountsSorted
}

export type UpdateOrderAccounts = string => (Dispatch<*>, Function) => void
export const updateOrderAccounts: UpdateOrderAccounts = (orderAccounts: string) => (
  dispatch,
  getState,
) => {
  const { accounts } = getState()
  dispatch({
    type: 'DB:SET_ACCOUNTS',
    payload: sortAccounts(accounts, orderAccounts),
  })
}

export type AddAccount = Account => (Function, Function) => void
export const addAccount: AddAccount = payload => (dispatch, getState) => {
  const {
    settings: { orderAccounts },
  } = getState()
  dispatch({ type: 'ADD_ACCOUNT', payload })
  dispatch(updateOrderAccounts(orderAccounts))
}

export type RemoveAccount = Account => { type: string, payload: Account }
export const removeAccount: RemoveAccount = payload => ({
  type: 'DB:REMOVE_ACCOUNT',
  payload,
})

export type FetchAccounts = () => (Function, Function) => *
export const fetchAccounts: FetchAccounts = () => (dispatch, getState) => {
  const {
    settings: { orderAccounts },
  } = getState()
  const accounts = db.get('accounts')
  dispatch({
    type: 'SET_ACCOUNTS',
    payload: sortAccounts(accounts, orderAccounts),
  })
}

export type UpdateAccountWithUpdater = (accountId: string, (Account) => Account) => *

export const updateAccountWithUpdater: UpdateAccountWithUpdater = (accountId, updater) => ({
  type: 'DB:UPDATE_ACCOUNT',
  payload: { accountId, updater },
})

export type UpdateAccount = ($Shape<Account>) => (Function, Function) => void
export const updateAccount: UpdateAccount = payload => (dispatch, getState) => {
  const {
    settings: { orderAccounts },
  } = getState()
  dispatch({
    type: 'DB:UPDATE_ACCOUNT',
    payload: {
      updater: account => ({ ...account, ...payload }),
      accountId: payload.id,
    },
  })
  dispatch(updateOrderAccounts(orderAccounts))
  // TODO should not be here IMO.. feels wrong for perf, probably better to move in reducer too
}

export const cleanAccountsCache = () => ({ type: 'CLEAN_ACCOUNTS_CACHE' })
