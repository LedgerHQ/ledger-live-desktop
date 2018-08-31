// @flow
import network from 'api/network'
import type { DeviceInfo, DeviceVersion, FinalFirmware, ApplicationVersion } from 'helpers/types'

import { APPLICATIONS_BY_DEVICE } from 'helpers/urls'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getCurrentFirmware from 'helpers/devices/getCurrentFirmware'

type NetworkResponse = { data: { application_versions: Array<ApplicationVersion> } }

export default async (deviceInfo: DeviceInfo): Promise<Array<ApplicationVersion>> => {
  const deviceData: DeviceVersion = await getDeviceVersion(
    deviceInfo.targetId,
    deviceInfo.providerId,
  )
  const firmwareData: FinalFirmware = await getCurrentFirmware({
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
  }: NetworkResponse = await network({ method: 'POST', url: APPLICATIONS_BY_DEVICE, data: params })
  return application_versions.length > 0 ? application_versions : []
}
