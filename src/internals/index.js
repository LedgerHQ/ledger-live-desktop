// @flow
import commands from 'commands'
import logger from 'logger'
import uuid from 'uuid/v4'
import { setImplementation } from 'api/network'
import sentry from 'sentry/node'
import { EXPERIMENTAL_HTTP_ON_RENDERER } from 'config/constants'
import { serializeError } from 'helpers/errors'

require('../env')

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

const subscriptions = {}

process.on('message', m => {
  if (m.type === 'command') {
    const { data, requestId, id } = m.command
    const cmd = commands.find(cmd => cmd.id === id)
    if (!cmd) {
      logger.warn(`command ${id} not found`)
      return
    }
    const startTime = Date.now()
    logger.onCmd('cmd.START', id, 0, data)
    subscriptions[requestId] = cmd.impl(data).subscribe({
      next: data => {
        logger.onCmd('cmd.NEXT', id, Date.now() - startTime, data)
        process.send({
          type: 'cmd.NEXT',
          requestId,
          data,
        })
      },
      complete: () => {
        delete subscriptions[requestId]
        logger.onCmd('cmd.COMPLETE', id, Date.now() - startTime)
        process.send({
          type: 'cmd.COMPLETE',
          requestId,
        })
      },
      error: error => {
        logger.warn('Command error:', error)
        delete subscriptions[requestId]
        logger.onCmd('cmd.ERROR', id, Date.now() - startTime, error)
        process.send({
          type: 'cmd.ERROR',
          requestId,
          data: serializeError(error),
        })
      },
    })
  } else if (m.type === 'command-unsubscribe') {
    const { requestId } = m
    const sub = subscriptions[requestId]
    if (sub) {
      sub.unsubscribe()
      delete subscriptions[requestId]
    }
  } else if (m.type === 'executeHttpQueryPayload') {
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
  } else if (m.type === 'sentryLogsChanged') {
    const { payload } = m
    sentryEnabled = payload.value
  }
})

process.on('disconnect', () => {
  process.exit(0)
})

logger.log('Internal process is up!')
