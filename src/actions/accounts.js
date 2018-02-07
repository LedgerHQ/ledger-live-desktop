// @flow

import db from 'helpers/db'
import sortBy from 'lodash/sortBy'

import type { Dispatch } from 'redux'
import type { Account } from 'types/common'

function sortAccounts(accounts, orderAccounts) {
  const accountsSorted = sortBy(accounts, a => {
    if (orderAccounts === 'balance') {
      return a.data.balance
    }

    return a[orderAccounts]
  })

  if (orderAccounts === 'balance') {
    accountsSorted.reverse()
  }

  return accountsSorted
}

export type AddAccount = Account => { type: string, payload: Account }
export const addAccount: AddAccount = payload => ({
  type: 'DB:ADD_ACCOUNT',
  payload,
})

export type UpdateAccount = Account => { type: string, payload: Account }
export const updateAccount: AddAccount = payload => ({
  type: 'DB:UPDATE_ACCOUNT',
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
