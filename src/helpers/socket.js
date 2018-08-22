// @flow

import invariant from 'invariant'
import logger from 'logger'
import Websocket from 'ws'
import type Transport from '@ledgerhq/hw-transport'
import { Observable } from 'rxjs'
import { createCustomErrorClass } from './errors'

const WebsocketConnectionError = createCustomErrorClass('WebsocketConnectionError')
const WebsocketConnectionFailed = createCustomErrorClass('WebsocketConnectionFailed')
const DeviceSocketFail = createCustomErrorClass('DeviceSocketFail')
const DeviceSocketNoBulkStatus = createCustomErrorClass('DeviceSocketNoBulkStatus')
const DeviceSocketNoHandler = createCustomErrorClass('DeviceSocketNoHandler')

/**
 * use Ledger WebSocket API to exchange data with the device
 * Returns an Observable of the final result
 */
export const createDeviceSocket = (transport: Transport<*>, url: string) =>
  Observable.create(o => {
    let ws
    let lastMessage: ?string

    try {
      ws = new Websocket(url)
    } catch (err) {
      o.error(new WebsocketConnectionFailed(err.message, { url }))
      return () => {}
    }
    invariant(ws, 'websocket is available')

    ws.on('open', () => {
      logger.websocket('OPENED', { url })
    })

    ws.on('error', e => {
      logger.websocket('ERROR', { message: e.message, stack: e.stack })
      o.error(new WebsocketConnectionError(e.message, { url }))
    })

    ws.on('close', () => {
      logger.websocket('CLOSE')
      o.next(lastMessage || '')
      o.complete()
    })

    const send = (nonce, response, data) => {
      const msg = {
        nonce,
        response,
        data,
      }
      logger.websocket('SEND', msg)
      const strMsg = JSON.stringify(msg)
      ws.send(strMsg)
    }

    const handlers = {
      exchange: async input => {
        const { data, nonce } = input
        const r: Buffer = await transport.exchange(Buffer.from(data, 'hex'))
        const status = r.slice(r.length - 2)
        const buffer = r.slice(0, r.length - 2)
        const strStatus = status.toString('hex')
        send(nonce, strStatus === '9000' ? 'success' : 'error', buffer.toString('hex'))
      },

      bulk: async input => {
        const { data, nonce } = input

        // Execute all apdus and collect last status
        let lastStatus = null
        for (const apdu of data) {
          const r: Buffer = await transport.exchange(Buffer.from(apdu, 'hex'))
          lastStatus = r.slice(r.length - 2)

          if (lastStatus.toString('hex') !== '9000') break
        }

        if (!lastStatus) {
          throw new DeviceSocketNoBulkStatus()
        }

        const strStatus = lastStatus.toString('hex')

        send(
          nonce,
          strStatus === '9000' ? 'success' : 'error',
          strStatus === '9000' ? '' : strStatus,
        )
      },

      success: msg => {
        lastMessage = msg.data || msg.result
        ws.close()
      },

      error: msg => {
        logger.websocket('ERROR', { data: msg.data })
        throw new DeviceSocketFail(msg.data, { url })
      },
    }

    const stackMessage = async rawMsg => {
      try {
        const msg = JSON.parse(rawMsg)
        if (!(msg.query in handlers)) {
          throw new DeviceSocketNoHandler(`Cannot handle msg of type ${msg.query}`, {
            query: msg.query,
            url,
          })
        }
        logger.websocket('RECEIVE', msg)
        await handlers[msg.query](msg)
      } catch (err) {
        logger.websocket('ERROR', { message: err.message, stack: err.stack })
        o.error(err)
      }
    }

    ws.on('message', async rawMsg => {
      stackMessage(rawMsg)
    })

    return () => {
      if (ws.readyState === 1) {
        lastMessage = null
        ws.close()
      }
    }
  })
