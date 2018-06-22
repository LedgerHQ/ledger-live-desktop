// @flow
import network from 'api/network'
import { GET_LATEST_FIRMWARE } from 'helpers/urls'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import getCurrentFirmware from './getCurrentFirmware'
import getDeviceVersion from './getDeviceVersion'

export default async (deviceInfo: DeviceInfo) => {
  try {
    // Get device infos from targetId
    const deviceVersion = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)

    // Get firmware infos with firmware name and device version
    const seFirmwareVersion = await getCurrentFirmware({
      fullVersion: deviceInfo.fullVersion,
      deviceId: deviceVersion.id,
      provider: deviceInfo.providerId,
    })

    // Fetch next possible firmware
    const { data } = await network({
      method: 'POST',
      url: GET_LATEST_FIRMWARE,
      data: {
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId,
      },
    })

    if (data.result === 'null') {
      return null
    }

    const { se_firmware_osu_version } = data
    return se_firmware_osu_version
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
