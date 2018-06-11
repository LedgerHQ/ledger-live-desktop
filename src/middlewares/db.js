/* eslint-disable consistent-return */

import db from 'helpers/db'

import { accountsSelector } from 'reducers/accounts'
import { settingsExportSelector, areSettingsLoaded } from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

let DB_MIDDLEWARE_ENABLED = true

// ability to temporary disable the db middleware from outside
export const disable = (ms = 1000) => {
  DB_MIDDLEWARE_ENABLED = false
  setTimeout(() => (DB_MIDDLEWARE_ENABLED = true), ms)
}

export default store => next => action => {
  if (DB_MIDDLEWARE_ENABLED && action.type.startsWith('DB:')) {
    const [, type] = action.type.split(':')
    store.dispatch({ type, payload: action.payload })
    const state = store.getState()
    db.set('accounts', accountsSelector(state))
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
