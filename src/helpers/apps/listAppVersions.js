// @flow
import network from 'api/network'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import { APPLICATIONS_BY_DEVICE } from 'helpers/urls'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getCurrentFirmware from 'helpers/devices/getCurrentFirmware'

export default async (deviceInfo: DeviceInfo) => {
  const deviceData = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)
  const firmwareData = await getCurrentFirmware({
    deviceId: deviceData.id,
    fullVersion: deviceInfo.fullVersion,
    provider: deviceInfo.providerId,
  })
  const params = {
    provider: deviceInfo.providerId,
    current_se_firmware_final_version: firmwareData.id,
    device_version: deviceData.id,
  }
  const {
    data: { application_versions },
  } = await network({ method: 'POST', url: APPLICATIONS_BY_DEVICE, data: params })
  return application_versions.length > 0 ? application_versions : []
}
