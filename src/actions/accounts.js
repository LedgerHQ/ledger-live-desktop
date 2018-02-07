// @flow

import db from 'helpers/db'

import type { Account } from 'types/common'

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

type FetchAccounts = () => { type: string }
export const fetchAccounts: FetchAccounts = () => {
  const payload = db.get('accounts')
  return {
    type: 'SET_ACCOUNTS',
    payload,
  }
}
