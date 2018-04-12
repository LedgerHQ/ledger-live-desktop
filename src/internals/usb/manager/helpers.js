// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import chalk from 'chalk'
import Websocket from 'ws'
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import type { IPCSend } from 'types/electron'
import { BASE_SOCKET_URL, APDUS } from './constants'

type WebsocketType = {
  send: (string, any) => void,
  on: (string, Function) => void,
}

type Message = {
  nonce: number,
  query?: string,
  response?: string,
  data: any,
}

type LedgerAppParams = {
  firmware?: string,
  firmwareKey?: string,
  delete?: string,
  deleteKey?: string,
}

/**
 * Generate handler which create transport with given
 * `devicePath` then call action with it
 */
export function createTransportHandler(
  send: IPCSend,
  {
    action,
    successResponse,
    errorResponse,
  }: {
    action: (Transport<*>, ...any) => Promise<any>,
    successResponse: string,
    errorResponse: string,
  },
) {
  return async function transportHandler({
    devicePath,
    ...params
  }: {
    devicePath: string,
  }): Promise<void> {
    try {
      const transport: Transport<*> = await CommNodeHid.open(devicePath)
      // $FlowFixMe
      const data = await action(transport, params)
      send(successResponse, data)
    } catch (err) {
      if (!err) {
        send(errorResponse, { message: 'Unknown error...' })
      }
      send(errorResponse, { message: err.message, stack: err.stack })
    }
  }
}

/**
 * Install an app on the device
 */
export async function installApp(
  transport: Transport<*>,
  { appParams }: { appParams: LedgerAppParams },
): Promise<void> {
  return createSocketDialog(transport, '/install', appParams)
}

/**
 * Uninstall an app on the device
 */
export async function uninstallApp(
  transport: Transport<*>,
  { appParams }: { appParams: LedgerAppParams },
): Promise<void> {
  return createSocketDialog(transport, '/install', {
    ...appParams,
    firmware: appParams.delete,
    firmwareKey: appParams.deleteKey,
  })
}

export async function getMemInfos(transport: Transport<*>): Promise<Object> {
  const { targetId } = await getFirmwareInfo(transport)
  // Dont ask me about this `perso_11`: I don't know. But we need it.
  return createSocketDialog(transport, '/get-mem-infos', { targetId, perso: 'perso_11' })
}

/**
 * Send data through ws
 */
function socketSend(ws: WebsocketType, msg: Message) {
  logWS('SEND', msg)
  const strMsg = JSON.stringify(msg)
  ws.send(strMsg)
}

/**
 * Exchange data on transport
 */
async function exchange(ws: WebsocketType, transport: Transport<*>, msg: Message): Promise<void> {
  const { data, nonce } = msg
  const r: Buffer = await transport.exchange(Buffer.from(data, 'hex'))
  const status = r.slice(r.length - 2)
  const buffer = r.slice(0, r.length - 2)
  const strStatus = status.toString('hex')
  socketSend(ws, {
    nonce,
    response: strStatus === '9000' ? 'success' : 'error',
    data: buffer.toString('hex'),
  })
}

/**
 * Bulk update on transport
 */
async function bulk(ws: WebsocketType, transport: Transport<*>, msg: Message) {
  const { data, nonce } = msg

  // Execute all apdus and collect last status
  let lastStatus = null
  for (const apdu of data) {
    const r: Buffer = await transport.exchange(Buffer.from(apdu, 'hex'))
    lastStatus = r.slice(r.length - 2)
  }
  if (!lastStatus) {
    throw new Error('No status collected from bulk')
  }

  const strStatus = lastStatus.toString('hex')
  socketSend(ws, {
    nonce,
    response: strStatus === '9000' ? 'success' : 'error',
    data: strStatus === '9000' ? '' : strStatus,
  })
}

/**
 * Open socket connection with firmware api, and init a dialog
 * with the device
 */
function createSocketDialog(transport: Transport<*>, endpoint: string, appParams: LedgerAppParams) {
  return new Promise(async (resolve, reject) => {
    try {
      let lastData
      const url = `${BASE_SOCKET_URL}${endpoint}?${qs.stringify(appParams)}`

      log('WS CONNECTING', url)
      const ws: WebsocketType = new Websocket(url)

      ws.on('open', () => log('WS CONNECTED'))

      ws.on('close', () => {
        log('WS CLOSED')
        resolve(lastData)
      })

      ws.on('message', async rawMsg => {
        const handlers = {
          exchange: msg => exchange(ws, transport, msg),
          bulk: msg => bulk(ws, transport, msg),
          success: msg => {
            if (msg.data) {
              lastData = msg.data
            }
          },
          error: msg => {
            log('WS ERROR', ':(')
            throw new Error(msg.data)
          },
        }
        try {
          const msg = JSON.parse(rawMsg)
          if (!(msg.query in handlers)) {
            throw new Error(`Cannot handle msg of type ${msg.query}`)
          }
          logWS('RECEIVE', msg)
          await handlers[msg.query](msg)
        } catch (err) {
          log('ERROR', err.toString())
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Retrieve targetId and firmware version from device
 */
export async function getFirmwareInfo(transport: Transport<*>) {
  const res = await transport.send(...APDUS.GET_FIRMWARE)
  const byteArray = [...res]
  const data = byteArray.slice(0, byteArray.length - 2)
  const targetIdStr = Buffer.from(data.slice(0, 4))
  const targetId = targetIdStr.readUIntBE(0, 4)
  const versionLength = data[4]
  const version = Buffer.from(data.slice(5, 5 + versionLength)).toString()
  return { targetId, version }
}

/**
 * Debug helper
 */
function log(namespace: string, str: string = '', color?: string) {
  namespace = namespace.padEnd(15)
  const coloredNamespace = color ? chalk[color](namespace) : namespace
  if (__DEV__) {
    console.log(`${chalk.bold(`> ${coloredNamespace}`)} ${str}`) // eslint-disable-line no-console
  }
}

/**
 * Log a socket send/receive
 */
function logWS(type: string, msg: Message) {
  const arrow = type === 'SEND' ? '↑' : '↓'
  const namespace = `${arrow} WS ${type}`
  const color = type === 'SEND' ? 'blue' : 'red'
  if (msg.nonce) {
    let d = ''
    if (msg.query === 'exchange') {
      d = msg.data.length > 100 ? `${msg.data.substr(0, 97)}...` : msg.data
    } else if (msg.query === 'bulk') {
      d = `[bulk x ${msg.data.length}]`
    }
    log(
      namespace,
      `${String(msg.nonce).padEnd(2)} ${(msg.response || msg.query || '').padEnd(10)} ${d}`,
      color,
    )
  } else {
    log(namespace, JSON.stringify(msg), color)
  }
}
