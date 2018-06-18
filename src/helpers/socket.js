// @flow

import logger from 'logger'
import Websocket from 'ws'
import type Transport from '@ledgerhq/hw-transport'
import { Observable } from 'rxjs'
import createCustomErrorClass from './createCustomErrorClass'

const WebsocketConnectionClose = createCustomErrorClass('WebsocketConnectionClose')
const DeviceSocketFail = createCustomErrorClass('DeviceSocketFail')
const DeviceSocketNoBulkStatus = createCustomErrorClass('DeviceSocketNoBulkStatus')
const DeviceSocketNoHandler = createCustomErrorClass('DeviceSocketNoHandler')

/**
 * use Ledger WebSocket API to exchange data with the device
 * Returns an Observable of the final result
 */
export const createDeviceSocket = (transport: Transport<*>, url: string) =>
  Observable.create(o => {
    try {
      const ws = new Websocket(url)

      ws.on('open', () => {
        logger.websocket('OPENED', url)
      })

      ws.on('close', () => {
        logger.websocket('CLOSE')
        o.error(new WebsocketConnectionClose())
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
          const res = msg.data || msg.result
          o.next(res)
          o.complete()
        },

        error: msg => {
          logger.websocket('ERROR', msg.data)
          throw new DeviceSocketFail(msg.data)
        },
      }

      let queue = Promise.resolve()

      const stackMessage = async rawMsg => {
        try {
          const msg = JSON.parse(rawMsg)
          if (!(msg.query in handlers)) {
            throw new DeviceSocketNoHandler(`Cannot handle msg of type ${msg.query}`, {
              query: msg.query,
            })
          }
          queue = queue.then(() => {
            logger.websocket('RECEIVE', msg)
            return handlers[msg.query](msg)
          })
          await queue
        } catch (err) {
          logger.websocket('ERROR', err.toString())
          o.error(err)
        }
      }

      ws.on('message', async rawMsg => {
        stackMessage(rawMsg)
      })
    } catch (err) {
      o.error(err)
    }
  })
