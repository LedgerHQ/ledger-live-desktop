// @flow

import '@babel/polyfill'
import { serializeError } from '@ledgerhq/errors'

import 'helpers/live-common-setup'
import 'helpers/live-common-setup-internal-hw'

import { log } from '@ledgerhq/logs'
import { getCurrencyBridge } from '@ledgerhq/live-common/lib/bridge'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import logger from 'logger'
import LoggerTransport from 'logger/logger-transport-internal'
import uuid from 'uuid/v4'
import { setImplementation } from 'api/network'
import sentry from 'sentry/node'
import { EXPERIMENTAL_HTTP_ON_RENDERER } from 'config/constants'
import { executeCommand, unsubscribeCommand } from 'main/commandHandler'

require('../env')

logger.add(new LoggerTransport())

process.title = 'Ledger Live Internal'

process.on('uncaughtException', err => {
  process.send({
    type: 'uncaughtException',
    error: serializeError(err),
  })
  // FIXME we should ideally do this:
  // process.exit(1)
  // but for now, until we kill all exceptions:
  logger.critical(err, 'uncaughtException')
})

const defers = {}

let sentryEnabled = process.env.INITIAL_SENTRY_ENABLED || false

sentry(() => sentryEnabled, process.env.SENTRY_USER_ID)

if (EXPERIMENTAL_HTTP_ON_RENDERER) {
  setImplementation(networkArg => {
    const id = uuid()
    return new Promise((resolve, reject) => {
      process.send({
        type: 'executeHttpQueryOnRenderer',
        networkArg,
        id,
      })
      defers[id] = {
        resolve: r => {
          resolve(r)
          delete defers[id]
        },
        reject: e => {
          reject(e)
          delete defers[id]
        },
      }
    })
  })
}

process.on('message', m => {
  switch (m.type) {
    case 'command':
      executeCommand(m.command, process.send.bind(process))
      break

    case 'command-unsubscribe':
      unsubscribeCommand(m.requestId)
      break

    case 'executeHttpQueryPayload': {
      const { payload } = m
      const defer = defers[payload.id]
      if (!defer) {
        logger.warn('executeHttpQueryPayload: no defer found')
        return
      }
      if (payload.type === 'success') {
        defer.resolve(payload.result)
      } else {
        defer.reject(payload.error)
      }
      break
    }

    case 'sentryLogsChanged': {
      const { payload } = m
      sentryEnabled = payload.value
      break
    }

    case 'hydrateCurrencyData': {
      const { currencyId, serialized } = m
      const currency = getCryptoCurrencyById(currencyId)
      const data = serialized && JSON.parse(serialized)
      log('hydrateCurrencyData', `hydrate currency ${currency.id}`)
      getCurrencyBridge(currency).hydrate(data)
      break
    }

    case 'init': {
      const { hydratedPerCurrency } = m

      // hydrate all
      log('init', `hydrate currencies ${Object.keys(hydratedPerCurrency).join(', ')}`)
      Object.keys(hydratedPerCurrency).forEach(currencyId => {
        const currency = getCryptoCurrencyById(currencyId)
        const serialized = hydratedPerCurrency[currencyId]
        const data = serialized && JSON.parse(serialized)
        getCurrencyBridge(currency).hydrate(data)
      })

      break
    }

    default:
      log('error', `internal thread: '${m.type}' event not supported`)
  }
})

process.on('disconnect', () => {
  process.exit(0)
})

logger.log('Internal process is up!')
