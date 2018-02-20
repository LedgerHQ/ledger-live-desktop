// @flow

import db from 'helpers/db'
import sortBy from 'lodash/sortBy'

import type { Dispatch } from 'redux'
import type { Account } from 'types/common'

import { startSyncAccounts } from 'renderer/events'

function sortAccounts(accounts, orderAccounts) {
  const [order, sort] = orderAccounts.split('|')

  const accountsSorted = sortBy(accounts, a => {
    if (order === 'balance') {
      return a.data.balance
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
  const { settings: { orderAccounts }, accounts } = getState()
  dispatch({
    type: 'ADD_ACCOUNT',
    payload,
  })
  dispatch(updateOrderAccounts(orderAccounts))

  // Start sync accounts the first time you add an account
  if (accounts.length === 0) {
    startSyncAccounts([payload])
  }
}

export type RemoveAccount = Account => { type: string, payload: Account }
export const removeAccount: RemoveAccount = payload => ({
  type: 'DB:REMOVE_ACCOUNT',
  payload,
})

export type FetchAccounts = () => (Dispatch<*>, Function) => void
export const fetchAccounts: FetchAccounts = () => (dispatch, getState) => {
  const { settings: { orderAccounts } } = getState()
  const accounts = db.get('accounts')
  dispatch({
    type: 'SET_ACCOUNTS',
    payload: sortAccounts(accounts, orderAccounts),
  })
}

export type UpdateAccount = Account => (Function, Function) => void
export const updateAccount: UpdateAccount = payload => (dispatch, getState) => {
  const { settings: { orderAccounts } } = getState()
  dispatch({
    type: 'UPDATE_ACCOUNT',
    payload,
  })
  dispatch(updateOrderAccounts(orderAccounts))
}
