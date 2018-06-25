// @flow

// FIXME remove this file! 'helpers/common.js' RLY? :P
import type Transport from '@ledgerhq/hw-transport'

const APDUS = {
  GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
  // we dont have common call that works inside app & dashboard
  // TODO: this should disappear.
  GET_FIRMWARE_FALLBACK: [0xe0, 0xc4, 0x00, 0x00],
}

export type LedgerScriptParams = {
  firmware?: string,
  firmware_key?: string,
  delete?: string,
  delete_key?: string,
  targetId?: string | number,
  name: string,
  version: string,
  icon: string,
  app?: number,
}

/**
 * Retrieve targetId and firmware version from device
 */
export async function getFirmwareInfo(transport: Transport<*>) {
  try {
    const res = await transport.send(...APDUS.GET_FIRMWARE)
    const byteArray = [...res]
    const data = byteArray.slice(0, byteArray.length - 2)
    console.log('data', data)
    const targetIdStr = Buffer.from(data.slice(0, 4))
    const targetId = targetIdStr.readUIntBE(0, 4)
    console.log(targetId)
    const seVersionLength = data[4]
    const seVersion = Buffer.from(data.slice(5, 5 + seVersionLength)).toString()
    console.log('seversion', seVersion)
    const flagsLength = data[5 + seVersionLength]
    console.log('flagel', flagsLength)
    const flags = Buffer.from(
      data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength),
    ).toString()
    console.log('flags', flags)

    const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength]
    let mcuVersion = Buffer.from(
      data.slice(
        7 + seVersionLength + flagsLength,
        7 + seVersionLength + flagsLength + mcuVersionLength,
      ),
    )
    if (mcuVersion[mcuVersion.length - 1] === 0) {
      mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1)
    }
    mcuVersion = mcuVersion.toString()
    console.log('mcu', mcuVersion)
    return { targetId, seVersion, flags, mcuVersion }
  } catch (err) {
    const error = new Error(err.message)
    error.stack = err.stack
    throw error
  }
}
