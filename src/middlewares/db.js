/* eslint-disable consistent-return */

import db from 'helpers/db'

import { getAccounts } from 'reducers/accounts'
import { settingsExportSelector, areSettingsLoaded } from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

export default store => next => action => {
  if (action.type.startsWith('DB:')) {
    const [, type] = action.type.split(':')
    store.dispatch({ type, payload: action.payload })
    const state = store.getState()
    db.set('accounts', getAccounts(state))
    // ^ TODO ultimately we'll do same for accounts to drop DB: pattern
  } else {
    const oldState = store.getState()
    const res = next(action)
    const newState = store.getState()
    if (oldState.countervalues !== newState.countervalues) {
      db.set('countervalues', CounterValues.exportSelector(newState))
    }
    if (areSettingsLoaded(newState) && oldState.settings !== newState.settings) {
      db.set('settings', settingsExportSelector(newState))
    }
    return res
  }
}
