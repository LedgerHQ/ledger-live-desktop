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

const logCmds = !__DEV__ || process.env.DEBUG_COMMANDS
const logDb = !__DEV__ || process.env.DEBUG_DB
const logRedux = !__DEV__ || process.env.DEBUG_ACTION
const logTabkey = !__DEV__ || process.env.DEBUG_TAB_KEY

export default {

  onCmd: (type: string, id: string, spentTime: number, data?: any) => {
    if (logCmds) {
      switch (type) {
        case 'cmd.START':
          console.log(`CMD ${id}.send(`, data, ')')
          break
        case 'cmd.NEXT':
          console.log(`● CMD ${id}`, data)
          break
        case 'cmd.COMPLETE':
          console.log(`✔ CMD ${id} finished in ${spentTime.toFixed(0)}ms`)
          break
        case 'cmd.ERROR':
          console.warn(`✖ CMD ${id} error`, data)
          break
        default:
      }
    }
    addLog('cmd', type, id, spentTime, data)
  },

  onDB: (way: 'read' | 'write' | 'clear', name: string, obj: ?Object) => {
    const msg = `📁 ${way} ${name}:`
    if (logDb) {
      console.log(msg, obj)
    }
    addLog('db', msg)
  },

  // tracks Redux actions (NB not all actions are serializable)

  onReduxAction: (action: Object) => {
    if (logRedux) {
      console.log(`⚛️ ${action.type}`, action)
    }
    addLog('action', `⚛️ ${action.type}`, action)
  },

  // tracks keyboard events
  onTabKey: (activeElement: ?HTMLElement) => {
    if (!activeElement) return
    const { classList, tagName } = activeElement
    const displayEl = `${tagName.toLowerCase()}${classList.length ? ` ${classList.item(0)}` : ''}`
    const msg = `⇓ <TAB> - active element ${displayEl}`
    if (logTabkey) {
      console.log(msg)
    }
    addLog('keydown', msg)
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
