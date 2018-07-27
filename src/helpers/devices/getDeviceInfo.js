// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo } from 'helpers/common'
import { FORCE_PROVIDER } from 'config/constants'

export type DeviceInfo = {
  targetId: string | number,
  seVersion: string,
  isBootloader: boolean,
  flags: string,
  mcuVersion: string,
  isOSU: boolean,
  providerName: string,
}

export default async (transport: Transport<*>): Promise<DeviceInfo> => {
  const res = await getFirmwareInfo(transport)
  const { seVersion } = res
  const { targetId, mcuVersion, flags } = res
  const parsedVersion =
    seVersion.match(/([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-z]+))?(-osu)?/) || []
  const isOSU = typeof parsedVersion[5] !== 'undefined'
  const providerName = FORCE_PROVIDER || parsedVersion[4] || 'vanilla'
  const isBootloader = targetId === 0x01000001
  return {
    targetId,
    seVersion,
    isOSU,
    mcuVersion,
    isBootloader,
    providerName,
    flags,
  }
}
