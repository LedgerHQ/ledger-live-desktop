/* eslint-disable consistent-return */

import db from 'helpers/db'

import { getAccounts } from 'reducers/accounts'

export default store => next => action => {
  if (!action.type.startsWith('DB:')) {
    return next(action)
  }

  const { dispatch, getState } = store
  const [, type] = action.type.split(':')

  dispatch({ type, payload: action.payload })

  const state = getState()
  const { settings } = state

  const accounts = getAccounts(state)

  db.set('settings', settings)
  db.set('accounts', accounts)
}
