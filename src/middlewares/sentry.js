const Raven = require('raven-js')
require('../env')

import { sentryLogsBooleanSelector } from 'reducers/settings'

const { SENTRY_URL } = process.env

let isSentryInstalled = false

export default store => next => action => {
  next(action)
  if (__PROD__ && SENTRY_URL) {
    const state = store.getState()
    const sentryLogs = sentryLogsBooleanSelector(state)
    // if (sentryLogs !== isSentryInstalled) {
    //
    // }
  }
}
