// @flow

import type Transport from '@ledgerhq/hw-transport'

import getFirmwareInfo from 'helpers/firmware/getFirmwareInfo'
import { FORCE_PROVIDER } from 'config/constants'

export type DeviceInfo = {
  targetId: string | number,
  seVersion: string,
  isBootloader: boolean,
  flags: string,
  mcuVersion: string,
  isOSU: boolean,
  providerName: string,
  providerId: number,
  fullVersion: string,
}

const PROVIDERS = {
  '': 1,
  das: 2,
  club: 3,
  shitcoins: 4,
  ee: 5,
}

export default async (transport: Transport<*>): Promise<DeviceInfo> => {
  const res = await getFirmwareInfo(transport)
  const { seVersion } = res
  const { targetId, mcuVersion, flags } = res
  const parsedVersion =
    seVersion.match(/([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-z]+))?(-osu)?/) || []
  const isOSU = typeof parsedVersion[5] !== 'undefined'
  const providerName = parsedVersion[4] || ''
  const providerId = FORCE_PROVIDER || PROVIDERS[providerName]
  const isBootloader = targetId === 0x01000001
  const majMin = parsedVersion[1]
  const patch = parsedVersion[2] || '.0'
  const fullVersion = `${majMin}${patch}${providerName ? `-${providerName}` : ''}`
  return {
    targetId,
    seVersion: majMin + patch,
    isOSU,
    mcuVersion,
    isBootloader,
    providerName,
    providerId,
    flags,
    fullVersion,
  }
}
