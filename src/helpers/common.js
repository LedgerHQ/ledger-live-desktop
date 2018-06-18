// @flow

// FIXME remove this file! 'helpers/common.js' RLY? :P

import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'
import { createDeviceSocket } from './socket'

import { BASE_SOCKET_URL, APDUS, MANAGER_API_URL } from './constants'

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
