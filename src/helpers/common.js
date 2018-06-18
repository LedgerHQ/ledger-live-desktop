// @flow

import chalk from 'chalk'
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'
import { createDeviceSocket } from './socket'

import { BASE_SOCKET_URL, APDUS, MANAGER_API_URL } from './constants'

type Message = {
  nonce: number,
  query?: string,
  response?: string,
  data: any,
}

export type LedgerScriptParams = {
  firmware?: string,
  firmwareKey?: string,
  delete?: string,
  deleteKey?: string,
  targetId?: string | number,
}

type FirmwareUpdateType = 'osu' | 'final'

export async function getMemInfos(transport: Transport<*>): Promise<Object> {
  const { targetId } = await getFirmwareInfo(transport)
  // Dont ask me about this `perso_11`: I don't know. But we need it.
  return createSocketDialog(transport, '/get-mem-infos', { targetId, perso: 'perso_11' })
}

/**
 * Open socket connection with firmware api, and init a dialog
 * with the device
 */
export async function createSocketDialog(
  transport: Transport<*>,
  endpoint: string,
  params: LedgerScriptParams,
  managerUrl: boolean = false,
) {
  console.warn('DEPRECATED createSocketDialog: use createDeviceSocket') // eslint-disable-line
  const url = `${managerUrl ? MANAGER_API_URL : BASE_SOCKET_URL}${endpoint}?${qs.stringify(params)}`
  return createDeviceSocket(transport, url).toPromise()
}

/**
 * Retrieve targetId and firmware version from device
 */
export async function getFirmwareInfo(transport: Transport<*>) {
  try {
    const res = await transport.send(...APDUS.GET_FIRMWARE)
    const byteArray = [...res]
    const data = byteArray.slice(0, byteArray.length - 2)
    const targetIdStr = Buffer.from(data.slice(0, 4))
    const targetId = targetIdStr.readUIntBE(0, 4)
    const versionLength = data[4]
    const version = Buffer.from(data.slice(5, 5 + versionLength)).toString()
    return { targetId, version }
  } catch (err) {
    const error = new Error(err.message)
    error.stack = err.stack
    throw error
  }
}

/**
 * Debug helper
 */
export function log(namespace: string, str: string = '', color?: string) {
  namespace = namespace.padEnd(15)
  // $FlowFixMe
  const coloredNamespace = color ? chalk[color](namespace) : namespace
  if (__DEV__) {
    console.log(`${chalk.bold(`> ${coloredNamespace}`)} ${str}`) // eslint-disable-line no-console
  }
}

/**
 * Log a socket send/receive
 */
export function logWS(type: string, msg: Message) {
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

/**
 * Helpers to build OSU and Final firmware params
 */
export const buildParamsFromFirmware = (type: FirmwareUpdateType): Function => (
  data: any,
): LedgerScriptParams => ({
  firmware: data[`${type}_firmware`],
  firmwareKey: data[`${type}_firmware_key`],
  perso: data[`${type}_perso`],
  targetId: data[`${type}_target_id`],
})
