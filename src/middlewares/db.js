/* eslint-disable consistent-return */

import db from 'helpers/db'

import { getAccounts } from 'reducers/accounts'
import { settingsExportSelector } from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

export default store => next => action => {
  if (!action.type.startsWith('DB:')) {
    return next(action)
  }

  const { dispatch, getState } = store
  const [, type] = action.type.split(':')

  dispatch({ type, payload: action.payload })

  const state = getState()
  db.set('settings', settingsExportSelector(state))
  db.set('accounts', getAccounts(state))
  db.set('countervalues', CounterValues.exportSelector(state))
}
