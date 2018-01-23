// @flow

import { createAction } from 'redux-actions'

import type { Dispatch } from 'redux'

import db from 'helpers/db'

import type { Account } from 'types/common'

export type AddAccount = Account => { type: string, payload: Account }
export const addAccount: AddAccount = payload => ({
  type: 'DB:ADD_ACCOUNT',
  payload,
})

type FetchAccounts = () => { type: string }
export const fetchAccounts: FetchAccounts = () => ({
  type: 'FETCH_ACCOUNTS',
  payload: db('accounts'),
})

const setAccountData = createAction('SET_ACCOUNT_DATA', (accountID, data) => ({ accountID, data }))

export const syncAccount: Function = account => async (dispatch: Dispatch<*>) => {
  const { id, ...data } = account
  dispatch(setAccountData(id, data))
}
