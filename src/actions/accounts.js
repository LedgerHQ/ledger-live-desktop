// @flow

import values from 'lodash/values'
import { createAction } from 'redux-actions'

import type { Dispatch } from 'redux'

import db from 'helpers/db'

import type { Account } from 'types/common'
import type { State } from 'reducers'

import { getAccounts } from 'reducers/accounts'
import { getAddressData } from 'helpers/btc'

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
  const { address } = account
  const addressData = await getAddressData(address)
  dispatch(setAccountData(account.id, addressData))
}

export const syncAccounts = () => async (dispatch: Dispatch<*>, getState: () => State) => {
  const state = getState()
  const accountsMap = getAccounts(state)
  const accounts = values(accountsMap)

  console.log(`syncing accounts...`)

  await Promise.all(accounts.map(account => dispatch(syncAccount(account))))

  console.log(`all accounts synced`)
}
