// @flow
/* eslint-disable no-console */

/**
 * IDEA:
 * logger is an alternative to use for console.log that will be used for many purposes:
 * - provide useful data for debugging during dev (idea is to have opt-in env var)
 * - enabled in prod to provide useful data to debug when sending to Sentry
 * - for analytics in the future
 */

const logs = []

const MAX_LOG_LENGTH = 500
const MAX_LOG_JSON_THRESHOLD = 2000

function addLog(type, ...args) {
  logs.push({ type, date: new Date(), args })
  if (logs.length > MAX_LOG_LENGTH) {
    logs.shift()
  }
}

const makeSerializableLog = (o: mixed) => {
  if (typeof o === 'string') return o
  if (typeof o === 'number') return o
  if (typeof o === 'object' && o) {
    try {
      const json = JSON.stringify(o)
      if (json.length < MAX_LOG_JSON_THRESHOLD) {
        return o
      }
      // try to make a one level object on the same principle
      const oneLevel = {}
      Object.keys(o).forEach(key => {
        // $FlowFixMe
        oneLevel[key] = makeSerializableLog(o[key])
      })
      const json2 = JSON.stringify(oneLevel)
      if (json2.length < MAX_LOG_JSON_THRESHOLD) {
        return oneLevel
      }
    } catch (e) {
      // This is not serializable so we will just stringify it
    }
  }
  return String(o)
}

const logClicks = !__DEV__ || process.env.DEBUG_CLICK_ELEMENT
const logRedux = !__DEV__ || process.env.DEBUG_ACTION

export default {
  // tracks the user interactions (click, input focus/blur, what else?)

  onClickElement: (role: string, roleData: ?Object) => {
    const label = `👆 ${role}`
    if (roleData) {
      if (logClicks) {
        console.log(label, roleData)
      }
      addLog('click', label, roleData)
    } else {
      if (logClicks) {
        console.log(label)
      }
      addLog('click', label, roleData)
    }
  },

  // tracks Redux actions (NB not all actions are serializable)

  onReduxAction: (action: Object) => {
    if (logRedux) {
      console.log(`⚛️ ${action.type}`, action)
    }
    addLog('action', `⚛️ ${action.type}`, action)
  },

  // General functions in case the hooks don't apply

  log: (...args: any) => {
    console.log(...args)
    addLog('log', ...args)
  },
  warn: (...args: any) => {
    console.warn(...args)
    addLog('warn', ...args)
  },
  error: (...args: any) => {
    console.error(...args)
    addLog('error', ...args)
  },

  exportLogs: (): Array<{ type: string, date: Date, args: Array<any> }> =>
    logs.map(({ type, date, args }) => ({
      type,
      date,
      args: args.map(makeSerializableLog),
    })),
}
