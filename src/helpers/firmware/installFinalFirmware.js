// @flow
import type Transport from '@ledgerhq/hw-transport'
import type { DeviceInfo, DeviceVersion, OsuFirmware, FinalFirmware } from 'helpers/types'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getOsuFirmware from 'helpers/devices/getOsuFirmware'
import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import { ManagerDeviceLockedError } from '@ledgerhq/live-common/lib/errors'

import getFinalFirmwareById from './getFinalFirmwareById'

function remapSocketError(promise) {
  return promise.catch((e: Error) => {
    switch (true) {
      case e.message.endsWith('6982'):
        throw new ManagerDeviceLockedError()
      default:
        throw e
    }
  })
}

type Result = Promise<{ success: boolean }>

export default async (transport: Transport<*>): Result => {
  try {
    const deviceInfo: DeviceInfo = await getDeviceInfo(transport)
    const device: DeviceVersion = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)
    const firmware: OsuFirmware = await getOsuFirmware({
      deviceId: device.id,
      version: deviceInfo.fullVersion,
      provider: deviceInfo.providerId,
    })
    const { next_se_firmware_final_version } = firmware
    const nextFirmware: FinalFirmware = await getFinalFirmwareById(next_se_firmware_final_version)

    const params = {
      targetId: deviceInfo.targetId,
      ...nextFirmware,
      firmwareKey: nextFirmware.firmware_key,
    }

    const url = WS_INSTALL(params)
    await remapSocketError(createDeviceSocket(transport, url).toPromise())
    return { success: true }
  } catch (error) {
    throw error
  }
}
