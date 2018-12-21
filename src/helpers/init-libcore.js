// @flow

import logger from 'logger'
import invariant from 'invariant'
import network from 'api/network'
import { serializeError } from '@ledgerhq/live-common/lib/errors/helpers'

const lib = require('@ledgerhq/ledger-core')

const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const MAX_RANDOM = 2684869021

const core = new lib.NJSLedgerCore()
const stringVersion = core.getStringVersion()
const sqlitePrefix = `v${stringVersion.split('.')[0]}`

const bytesArrayToString = (bytesArray = []) => Buffer.from(bytesArray).toString()

const stringToBytesArray = str => Array.from(Buffer.from(str))

const NJSExecutionContextImpl = {
  execute: runnable => {
    try {
      const runFunction = () => runnable.run()
      setImmediate(runFunction)
    } catch (e) {
      logger.log(e)
    }
  },
  delay: (runnable, ms) => setTimeout(() => runnable.run(), ms),
}

const ThreadContexts = {}

const getSerialExecutionContext = name => {
  let currentContext = ThreadContexts[name]
  if (!currentContext) {
    currentContext = new lib.NJSExecutionContext(NJSExecutionContextImpl)
    ThreadContexts[name] = currentContext
  }
  return currentContext
}

const NJSThreadDispatcher = new lib.NJSThreadDispatcher({
  contexts: ThreadContexts,
  getThreadPoolExecutionContext: name => getSerialExecutionContext(name),
  getMainExecutionContext: () => getSerialExecutionContext('main'),
  getSerialExecutionContext,
  newLock: () => {
    logger.warn('libcore NJSThreadDispatcher: newLock: Not implemented')
  },
})

function createHttpConnection(res, err) {
  if (!res) {
    return null
  }
  const headersMap = new Map()
  Object.keys(res.headers).forEach(key => {
    if (typeof res.headers[key] === 'string') {
      headersMap.set(key, res.headers[key])
    }
  })
  const NJSHttpUrlConnectionImpl = {
    getStatusCode: () => Number(res.status),
    getStatusText: () => res.statusText,
    getHeaders: () => headersMap,
    readBody: () => ({
      error: err ? { code: 0, message: 'something went wrong' } : null,
      data: stringToBytesArray(JSON.stringify(res.data)),
    }),
  }
  return new lib.NJSHttpUrlConnection(NJSHttpUrlConnectionImpl)
}

const NJSHttpClient = new lib.NJSHttpClient({
  execute: async r => {
    const method = r.getMethod()
    const headersMap = r.getHeaders()
    let data = r.getBody()
    if (Array.isArray(data)) {
      const dataStr = bytesArrayToString(data)
      try {
        data = JSON.parse(dataStr)
      } catch (e) {
        // not a json !?
      }
    }
    const url = r.getUrl()
    const headers = {}
    headersMap.forEach((v, k) => {
      headers[k] = v
    })
    let res
    try {
      // $FlowFixMe
      res = await network({ method: lib.METHODS[method], url, headers, data })
      const urlConnection = createHttpConnection(res)
      r.complete(urlConnection, null)
    } catch (err) {
      const urlConnection = createHttpConnection(res, err.message)
      r.complete(urlConnection, { code: 0, message: JSON.stringify(serializeError(err)) })
    }
  },
})

const NJSWebSocketClient = new lib.NJSWebSocketClient({
  connect: (url, connection) => {
    connection.OnConnect()
  },
  send: (connection, data) => {
    connection.OnMessage(data)
  },
  disconnect: connection => {
    connection.OnClose()
  },
})

const NJSLogPrinter = new lib.NJSLogPrinter({
  context: {},
  printError: message => logger.libcore('Error', message),
  printInfo: message => logger.libcore('Info', message),
  printDebug: message => logger.libcore('Debug', message),
  printWarning: message => logger.libcore('Warning', message),
  printApdu: message => logger.libcore('Apdu', message),
  printCriticalError: message => logger.libcore('CriticalError', message),
  getContext: () => new lib.NJSExecutionContext(NJSExecutionContextImpl),
})

const NJSRandomNumberGenerator = new lib.NJSRandomNumberGenerator({
  getRandomBytes: size => crypto.randomBytes(size),
  getRandomInt: () => Math.random() * MAX_RANDOM,
  getRandomLong: () => Math.random() * MAX_RANDOM * MAX_RANDOM,
})

const NJSDatabaseBackend = new lib.NJSDatabaseBackend()
const NJSDynamicObject = new lib.NJSDynamicObject()

let walletPoolInstance = null

const instanciateWalletPool = ({ dbPath }) => {
  try {
    fs.mkdirSync(dbPath)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }

  const NJSPathResolver = new lib.NJSPathResolver({
    resolveLogFilePath: pathToResolve => {
      const hash = pathToResolve.replace(/\//g, '__')
      return path.resolve(dbPath, `./log_file_${sqlitePrefix}_${hash}`)
    },
    resolvePreferencesPath: pathToResolve => {
      const hash = pathToResolve.replace(/\//g, '__')
      return path.resolve(dbPath, `./preferences_${sqlitePrefix}_${hash}`)
    },
    resolveDatabasePath: pathToResolve => {
      const hash = pathToResolve.replace(/\//g, '__')
      return path.resolve(dbPath, `./database_${sqlitePrefix}_${hash}`)
    },
  })

  walletPoolInstance = new lib.NJSWalletPool(
    'ledger_live_desktop',
    '',
    NJSHttpClient,
    NJSWebSocketClient,
    NJSPathResolver,
    NJSLogPrinter,
    NJSThreadDispatcher,
    NJSRandomNumberGenerator,
    NJSDatabaseBackend,
    NJSDynamicObject,
  )

  return walletPoolInstance
}

const getPoolInstance = () => {
  if (!walletPoolInstance) {
    instanciateWalletPool({
      // sqlite files will be located in the app local data folder
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    })
  }
  invariant(walletPoolInstance, "can't initialize walletPoolInstance")
  return walletPoolInstance
}

export default {
  ...lib,
  getSerialExecutionContext,
  getPoolInstance,
}
