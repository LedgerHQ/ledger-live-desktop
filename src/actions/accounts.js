// @flow

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
