// @flow
/* eslint-disable no-console */

/**
 * IDEA:
 * logger is an alternative to use for console.log that will be used for many purposes:
 * - provide useful data for debugging during dev (idea is to have opt-in env var)
 * - enabled in prod to provide useful data to debug when sending to Sentry
 * - for analytics in the future
 */

export default {
  // tracks the user interactions (click, input focus/blur, what else?)

  onClickElement: (role: string, roleData: ?Object) => {
    if (!__DEV__ || process.env.DEBUG_CLICK_ELEMENT) {
      const label = `👆 ${role}`
      if (roleData) {
        console.log(label, roleData)
      } else {
        console.log(label)
      }
    }
  },

  // tracks Redux actions (NB not all actions are serializable)

  onReduxAction: (action: Object) => {
    if (!__DEV__ || process.env.DEBUG_ACTION) {
      console.log(`⚛️ ${action.type}`, action)
    }
  },

  // General functions in case the hooks don't apply

  log: (...args: any) => {
    console.log(...args)
  },
  warn: (...args: any) => {
    console.warn(...args)
  },
  error: (...args: any) => {
    console.error(...args)
  },
}
