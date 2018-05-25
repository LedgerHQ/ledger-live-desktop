// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo } from 'helpers/common'

type Result = {
  targetId: string | number,
  version: string,
  mcu: boolean,
  final: boolean,
}

export default async (transport: Transport<*>): Promise<Result> => {
  try {
    const { targetId, version } = await getFirmwareInfo(transport)
    const finalReady = version.endsWith('-osu')
    const mcuReady = targetId === 0x01000001

    return { targetId, version, final: finalReady, mcu: mcuReady }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
