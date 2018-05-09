/* eslint-disable consistent-return */

import db from 'helpers/db'

import { getAccounts } from 'reducers/accounts'
import { settingsExportSelector } from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

export default store => next => action => {
  if (action.type.startsWith('DB:')) {
    const [, type] = action.type.split(':')
    store.dispatch({ type, payload: action.payload })
    const state = store.getState()
    db.set('settings', settingsExportSelector(state))
    db.set('accounts', getAccounts(state))
  } else {
    const oldState = store.getState()
    const res = next(action)
    const newState = store.getState()
    if (oldState.countervalues !== newState.countervalues) {
      db.set('countervalues', CounterValues.exportSelector(newState))
    }
    return res
  }
}
