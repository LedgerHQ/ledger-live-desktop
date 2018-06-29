// @flow
import type Transport from '@ledgerhq/hw-transport'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getOsuFirmware from 'helpers/devices/getOsuFirmware'
import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import getFinalFirmwareById from './getFinalFirmwareById'

type Result = Promise<{ success: boolean, error?: string }>

export default async (transport: Transport<*>): Result => {
  try {
    const deviceInfo: DeviceInfo = await getDeviceInfo(transport)
    const device = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)
    const firmware = await getOsuFirmware({ deviceId: device.id, version: deviceInfo.fullVersion })
    const { next_se_firmware_final_version } = firmware
    const nextFirmware = await getFinalFirmwareById(next_se_firmware_final_version)

    const params = {
      targetId: deviceInfo.targetId,
      ...nextFirmware,
      firmwareKey: nextFirmware.firmware_key,
    }

    const url = WS_INSTALL(params)
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (error) {
    const result = { success: false, error }
    throw result
  }
}
