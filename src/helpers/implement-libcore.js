// @flow
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */

import logger from 'logger'
import invariant from 'invariant'
import network from 'api/network'
import { NotEnoughBalance } from '@ledgerhq/errors'
import { deserializeError, serializeError } from '@ledgerhq/errors/lib/helpers'
import { setLoadCoreImplementation, libcoreJobBusy } from '@ledgerhq/live-common/lib/libcore/access'
import { setRemapLibcoreErrorsImplementation } from '@ledgerhq/live-common/lib/libcore/errors'
import type { Core, CoreStatics } from '@ledgerhq/live-common/lib/libcore/types'

if (!process.env.CLI) {
  libcoreJobBusy.subscribe(busy => {
    process.send({ type: 'setLibcoreBusy', busy })
  })
}

const lib = require('@ledgerhq/ledger-core')

const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const MAX_RANDOM = 2684869021

const core = new lib.NJSLedgerCore()
const stringVersion = core.getStringVersion()
const sqlitePrefix = `v${stringVersion.split('.')[0]}`

const hexToBytes = str => Array.from(Buffer.from(str, 'hex'))
const bytesToHex = buf => Buffer.from(buf).toString('hex')

const bytesArrayToString = (bytesArray = []) => Buffer.from(bytesArray).toString()

const stringToBytesArray = str => Array.from(Buffer.from(str))

const NJSExecutionContextImpl = {
  execute: runnable => {
    try {
      const runFunction = () => runnable.run()
      setImmediate(runFunction)
    } catch (e) {
      logger.error(e)
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

const getMainExecutionContext = () => getSerialExecutionContext('main')

const NJSThreadDispatcher = new lib.NJSThreadDispatcher({
  contexts: ThreadContexts,
  getThreadPoolExecutionContext: name => getSerialExecutionContext(name),
  getMainExecutionContext,
  getSerialExecutionContext,
  newLock: () => {
    logger.warn('libcore NJSThreadDispatcher: newLock: Not implemented')
  },
})

NJSThreadDispatcher.getMainExecutionContext = getMainExecutionContext

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
      r.complete(urlConnection, {
        code: 0,
        message: JSON.stringify(serializeError(err)),
      })
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
  getRandomBytes: size => Array.from(Buffer.from(crypto.randomBytes(size), 'hex')),
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
    'ledger_live_common',
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

const loadCore = (): Promise<Core> => {
  const statics = {}
  Object.keys(lib).forEach(k => {
    if (k.startsWith('NJS')) {
      statics[k.slice(3)] = lib[k]
    }
  })

  class AccountCreationInfo {
    constructor(data: *) {
      Object.assign(this, data)
    }
    static init(index, owners, derivations, publicKeys, chainCodes) {
      return new AccountCreationInfo({
        index,
        owners,
        derivations,
        publicKeys: publicKeys.map(hexToBytes),
        chainCodes: chainCodes.map(hexToBytes),
      })
    }
    getDerivations() {
      return this.derivations
    }
    derivations: *
    getChainCodes() {
      return this.chainCodes.map(bytesToHex)
    }
    chainCodes: *
    getPublicKeys() {
      return this.publicKeys.map(bytesToHex)
    }
    publicKeys: *
    getOwners() {
      return this.owners
    }
    owners: *
    getIndex() {
      return this.index
    }
    index: *
  }

  class Block {
    constructor(data: *) {
      Object.assign(this, data)
    }
    getHeight() {
      return this.height
    }
    height: *
  }

  class ExtendedKeyAccountCreationInfo {
    constructor(data: *) {
      Object.assign(this, data)
    }
    static init(index, owners, derivations, extendedKeys) {
      return new ExtendedKeyAccountCreationInfo({
        index,
        owners,
        derivations,
        extendedKeys,
      })
    }
    getIndex() {
      return this.index
    }
    index: *
    getExtendedKeys() {
      return this.extendedKeys
    }
    extendedKeys: *
    getOwners() {
      return this.owners
    }
    owners: *
    getDerivations() {
      return this.derivations
    }
    derivations: *
  }

  class BitcoinLikeNetworkParameters {
    constructor(data: *) {
      Object.assign(this, data)
    }
    getSigHash() {
      return bytesToHex(this.SigHash)
    }
    SigHash: *
    getUsesTimestampedTransaction() {
      return this.UsesTimestampedTransaction
    }
    UsesTimestampedTransaction: *
  }

  class Currency {
    constructor(data) {
      Object.assign(this, data)
    }
    getBitcoinLikeNetworkParameters() {
      return new BitcoinLikeNetworkParameters(this.bitcoinLikeNetworkParameters)
    }
    bitcoinLikeNetworkParameters: *
  }

  const eventBusSubscribe = statics.EventBus.prototype.subscribe
  statics.EventBus.prototype.subscribe = function(executionContext, receiver) {
    return new Promise((resolve, reject) => {
      receiver._resolve = resolve
      receiver._reject = reject
      eventBusSubscribe.call(this, executionContext, receiver)
    })
  }

  statics.EventReceiver.newInstance = () => {
    const receiver = new statics.EventReceiver({
      onEvent: e => {
        const code = e.getCode()
        if (code === lib.EVENT_CODE.UNDEFINED || code === lib.EVENT_CODE.SYNCHRONIZATION_FAILED) {
          const payload = e.getPayload()
          const message = (
            (payload && payload.getString('EV_SYNC_ERROR_MESSAGE')) ||
            'Sync failed'
          ).replace(' (EC_PRIV_KEY_INVALID_FORMAT)', '')
          try {
            receiver._reject(deserializeError(JSON.parse(message)))
          } catch (e) {
            receiver._reject(message)
          }
          return
        }
        if (
          code === lib.EVENT_CODE.SYNCHRONIZATION_SUCCEED ||
          code === lib.EVENT_CODE.SYNCHRONIZATION_SUCCEED_ON_PREVIOUSLY_EMPTY_ACCOUNT
        ) {
          receiver._resolve()
        }
      },
    })
    return receiver
  }

  function wrapMethod(className, methodName, wrap, paramsWrap) {
    const Clz = statics[className]
    const method = Clz.prototype[methodName]
    Clz.prototype[methodName] = async function() {
      const args = paramsWrap
        ? [...arguments].map((value, i) => (paramsWrap[i] ? paramsWrap[i](value) : value))
        : arguments
      const result = await method.apply(this, args)
      return wrap ? wrap(result) : result
    }
  }

  function wrapReturnClass(className, methodName, ReturnClass) {
    wrapMethod(className, methodName, r => new ReturnClass(r))
  }

  function wrapParams(className, methodName, paramsWrap) {
    wrapMethod(className, methodName, null, paramsWrap)
  }

  statics.AccountCreationInfo = AccountCreationInfo
  statics.ExtendedKeyAccountCreationInfo = ExtendedKeyAccountCreationInfo
  statics.Block = Block
  statics.Currency = Currency
  statics.BitcoinLikeNetworkParameters = BitcoinLikeNetworkParameters

  wrapReturnClass('Account', 'getLastBlock', Block)
  wrapReturnClass('Wallet', 'getAccountCreationInfo', AccountCreationInfo)
  wrapReturnClass('Wallet', 'getNextAccountCreationInfo', AccountCreationInfo)
  wrapReturnClass('Wallet', 'getExtendedKeyAccountCreationInfo', ExtendedKeyAccountCreationInfo)
  wrapReturnClass('WalletPool', 'getCurrency', Currency)
  wrapReturnClass('Wallet', 'getCurrency', Currency)

  wrapParams('BitcoinLikeAccount', 'broadcastRawTransaction', [hexToBytes])
  wrapMethod('BitcoinLikeInput', 'getPreviousTransaction', bytesToHex)
  wrapMethod('BitcoinLikeTransaction', 'serializeOutputs', bytesToHex)

  // define the static methods

  statics.LedgerCore.newInstance = () => new statics.LedgerCore()
  statics.DynamicObject.newInstance = () => new statics.DynamicObject()
  statics.Address.isValid = (...args) => new statics.Address(...args).isValid(...args)
  statics.Amount.fromHex = (...args) => new statics.Amount(...args).fromHex(...args)

  // $FlowFixMe
  const cs: CoreStatics = statics

  const core: Core = {
    ...cs,
    flush: () => Promise.resolve(),
    getPoolInstance,
    getThreadDispatcher: () => NJSThreadDispatcher,
  }

  return Promise.resolve(core)
}

const remapLibcoreErrors = (input: Error) => {
  const e: mixed = input
  if (e && typeof e === 'object') {
    if (typeof e.code === 'number' && e.code === 52) {
      return new NotEnoughBalance()
    }
  }
  return input
}

setLoadCoreImplementation(loadCore)
setRemapLibcoreErrorsImplementation(remapLibcoreErrors)
