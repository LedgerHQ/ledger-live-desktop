// @flow

import winston from 'winston'
import Transport from 'winston-transport'
import resolveLogsDirectory from 'helpers/resolveLogsDirectory'
import anonymizer from 'helpers/anonymizer'
import pname from 'helpers/pname'

import {
  DEBUG_DEVICE,
  DEBUG_NETWORK,
  DEBUG_COMMANDS,
  DEBUG_DB,
  DEBUG_ACTION,
  DEBUG_TAB_KEY,
  DEBUG_LIBCORE,
  DEBUG_WS,
  DEBUG_ANALYTICS,
} from 'config/constants'

require('winston-daily-rotate-file')

const { format } = winston
const { combine, json, timestamp } = format

const pinfo = format(info => {
  info.pname = pname
  return info
})

function createDailyRotateFile(processName) {
  return new winston.transports.DailyRotateFile({
    dirname: resolveLogsDirectory(),
    json: true,
    filename: `ledger-live-${processName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '7d',
  })
}

const transports = [createDailyRotateFile(pname)]

const queryLogs = (processName: string, date: Date) =>
  new Promise((resolve, reject) => {
    const dailyRotateFile = createDailyRotateFile(processName)
    const options = {
      from: date - 10 * 60 * 1000,
      until: date,
      limit: 500,
      start: 0,
      order: 'desc',
    }
    dailyRotateFile.query(options, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })

const queryAllLogs = async (date: Date = new Date()) => {
  const internal = await queryLogs('internal', date)
  const main = await queryLogs('main', date)
  const renderer = await queryLogs('renderer', date)
  const all = internal
    .concat(main)
    .concat(renderer)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return all
}

if (process.env.NODE_ENV !== 'production' || process.env.DEV_TOOLS) {
  let consoleT
  if (typeof window === 'undefined') {
    // on Node we want a concise logger
    consoleT = new winston.transports.Console({
      format: format.simple(),
    })
  } else {
    // On Browser we want to preserve direct usage of console with the "expandable" objects
    const SPLAT = Symbol.for('splat')
    class CustomConsole extends Transport {
      log(info, callback) {
        setImmediate(() => {
          this.emit('logged', info)
        })
        const rest = info[SPLAT]
        /* eslint-disable no-console, no-lonely-if */
        if (info.level === 'error') {
          if (rest) {
            console.error(info.message, ...rest)
          } else {
            console.error(info.message)
          }
        } else if (info.level === 'warn') {
          if (rest) {
            console.warn(info.message, ...rest)
          } else {
            console.warn(info.message)
          }
        } else {
          if (rest) {
            console.log(info.message, ...rest)
          } else {
            console.log(info.message)
          }
        }
        /* eslint-enable */
        callback()
      }
    }
    consoleT = new CustomConsole()
  }
  transports.push(consoleT)
}

const logger = winston.createLogger({
  level: 'info',
  format: combine(pinfo(), timestamp(), json()),
  transports,
})

const captureBreadcrumb = (breadcrumb: any) => {
  if (!process.env.STORYBOOK_ENV) {
    try {
      if (typeof window !== 'undefined') {
        require('sentry/browser').captureBreadcrumb(breadcrumb)
      } else {
        require('sentry/node').captureBreadcrumb(breadcrumb)
      }
    } catch (e) {
      logger.log('warn', "Can't captureBreadcrumb", e)
    }
  }
}

const logCmds = !__DEV__ || DEBUG_COMMANDS
const logDb = !__DEV__ || DEBUG_DB
const logRedux = !__DEV__ || DEBUG_ACTION
const logTabkey = !__DEV__ || DEBUG_TAB_KEY
const logLibcore = !__DEV__ || DEBUG_LIBCORE
const logWS = !__DEV__ || DEBUG_WS
const logNetwork = !__DEV__ || DEBUG_NETWORK
const logAnalytics = !__DEV__ || DEBUG_ANALYTICS
const logApdu = !__DEV__ || DEBUG_DEVICE

const blacklistTooVerboseCommandInput = ['libcoreSyncAccount', 'libcoreSignAndBroadcast']
const blacklistTooVerboseCommandResponse = [
  'libcoreSyncAccount',
  'libcoreScanAccounts',
  'listApps',
  'listAppVersions',
  'listCategories',
]

export default {
  onCmd: (type: string, id: string, spentTime: number, data?: any) => {
    if (logCmds) {
      switch (type) {
        case 'cmd.START':
          logger.log(
            'info',
            'info',
            `CMD ${id}.send()`,
            blacklistTooVerboseCommandInput.includes(id) ? { type } : { type, data },
          )
          break
        case 'cmd.NEXT':
          logger.log(
            'info',
            `● CMD ${id}`,
            blacklistTooVerboseCommandResponse.includes(id) ? { type } : { type, data },
          )
          break
        case 'cmd.COMPLETE':
          logger.log('info', `✔ CMD ${id} finished in ${spentTime.toFixed(0)}ms`, { type })
          captureBreadcrumb({
            category: 'command',
            message: `✔ ${id}`,
          })
          break
        case 'cmd.ERROR':
          logger.log('warn', `✖ CMD ${id} error`, { type, data })
          captureBreadcrumb({
            category: 'command',
            message: `✖ ${id}`,
          })
          break
        default:
      }
    }
  },

  onDB: (way: 'read' | 'write' | 'clear', name: string) => {
    const msg = `📁  ${way} ${name}`
    if (logDb) {
      logger.log('info', msg, { type: 'db' })
    }
  },

  // tracks Redux actions (NB not all actions are serializable)

  onReduxAction: (action: Object) => {
    if (logRedux) {
      logger.log('info', `⚛️  ${action.type}`, { type: 'action' })
    }
  },

  // tracks keyboard events
  onTabKey: (activeElement: ?HTMLElement) => {
    if (!activeElement) return
    const { classList, tagName } = activeElement
    const displayEl = `${tagName.toLowerCase()}${classList.length ? ` ${classList.item(0)}` : ''}`
    const msg = `⇓ <TAB> - active element ${displayEl}`
    if (logTabkey) {
      logger.log('info', msg, { type: 'keydown' })
    }
  },

  apdu: (log: string) => {
    if (logApdu) {
      logger.log('info', log, { type: 'apdu' })
    }
  },

  websocket: (type: string, msg: *) => {
    if (logWS) {
      logger.log('info', `~ ${type}:`, msg, { type: 'ws' })
    }
  },

  libcore: (level: string, msg: string) => {
    if (logLibcore) {
      logger.log('info', `🛠  ${level}: ${msg}`, { type: 'libcore' })
    }
  },

  network: ({ method, url }: { method: string, url: string }) => {
    const log = `➡📡  ${method} ${anonymizer.url(url)}`
    if (logNetwork) {
      logger.log('info', log, { type: 'network' })
    }
  },

  networkSucceed: ({
    method,
    url,
    status,
    responseTime,
  }: {
    method: string,
    url: string,
    status: number,
    responseTime: number,
  }) => {
    const anonymURL = anonymizer.url(url)

    const log = `✔📡  HTTP ${status} ${method} ${url} – finished in ${responseTime.toFixed(0)}ms`
    if (logNetwork) {
      logger.log('info', log, { type: 'network-response' })
    }
    captureBreadcrumb({
      category: 'network',
      message: 'network success',
      data: { url: anonymURL, status, method, responseTime },
    })
  },

  networkError: ({
    method,
    url,
    status,
    error,
    responseTime,
  }: {
    method: string,
    url: string,
    status: number,
    error: string,
    responseTime: number,
  }) => {
    const anonymURL = anonymizer.url(url)
    const log = `✖📡  HTTP ${status} ${method} ${url} – ${error} – failed after ${responseTime.toFixed(
      0,
    )}ms`
    if (logNetwork) {
      logger.log('info', log, { type: 'network-error', status, method })
    }
    captureBreadcrumb({
      category: 'network',
      message: 'network error',
      data: { url: anonymURL, status, method, responseTime },
    })
  },

  networkDown: ({
    method,
    url,
    responseTime,
  }: {
    method: string,
    url: string,
    responseTime: number,
  }) => {
    const log = `✖📡  NETWORK DOWN – ${method} ${url} – after ${responseTime.toFixed(0)}ms`
    if (logNetwork) {
      logger.log('info', log, { type: 'network-down' })
    }
    captureBreadcrumb({
      category: 'network',
      message: 'network down',
    })
  },

  analyticsStart: (id: string) => {
    if (logAnalytics) {
      logger.log('info', `△ start() with user id ${id}`, { type: 'anaytics-start', id })
    }
  },

  analyticsStop: () => {
    if (logAnalytics) {
      logger.log('info', `△ stop()`, { type: 'anaytics-stop' })
    }
  },

  analyticsTrack: (event: string, properties: ?Object) => {
    if (logAnalytics) {
      logger.log('info', `△ track ${event}`, { type: 'anaytics-track', properties })
    }
    captureBreadcrumb({
      category: 'track',
      message: event,
      data: properties,
    })
  },

  analyticsPage: (category: string, name: ?string, properties: ?Object) => {
    const message = name ? `${category} ${name}` : category
    if (logAnalytics) {
      logger.log('info', `△ page ${message}`, { type: 'anaytics-page', properties })
    }
    captureBreadcrumb({
      category: 'page',
      message,
      data: properties,
    })
  },

  // General functions in case the hooks don't apply

  log: (...args: any) => {
    logger.log('info', ...args)
  },

  warn: (...args: any) => {
    logger.log('warn', ...args)
  },

  error: (...args: any) => {
    logger.log('error', ...args)
  },

  critical: (error: Error, context?: string) => {
    if (context) {
      captureBreadcrumb({
        category: 'context',
        message: context,
      })
    }
    logger.log('error', error)
    if (!process.env.STORYBOOK_ENV) {
      try {
        if (typeof window !== 'undefined') {
          require('sentry/browser').captureException(error)
        } else {
          require('sentry/node').captureException(error)
        }
      } catch (e) {
        logger.log('warn', "Can't send to sentry", error, e)
      }
    }
  },

  queryAllLogs,
}
