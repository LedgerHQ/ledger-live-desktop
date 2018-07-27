// @flow

/* eslint-disable consistent-return */

import db from 'helpers/db'

import { accountsSelector } from 'reducers/accounts'
import { settingsExportSelector, areSettingsLoaded } from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

let DB_MIDDLEWARE_ENABLED = true

// ability to temporary disable the db middleware from outside
export const disable = (ms: number = 1000) => {
  DB_MIDDLEWARE_ENABLED = false
  setTimeout(() => (DB_MIDDLEWARE_ENABLED = true), ms)
}

export default (store: any) => (next: any) => (action: any) => {
  if (DB_MIDDLEWARE_ENABLED && action.type.startsWith('DB:')) {
    const [, type] = action.type.split(':')
    store.dispatch({ type, payload: action.payload })
    const state = store.getState()
    db.setKey('app', 'accounts', accountsSelector(state))
    // ^ TODO ultimately we'll do same for accounts to drop DB: pattern
  } else {
    const oldState = store.getState()
    const res = next(action)
    const newState = store.getState()
    if (oldState.countervalues !== newState.countervalues) {
      db.setKey('app', 'countervalues', CounterValues.exportSelector(newState))
    }
    if (areSettingsLoaded(newState) && oldState.settings !== newState.settings) {
      db.setKey('app', 'settings', settingsExportSelector(newState))
    }
    return res
  }
}
