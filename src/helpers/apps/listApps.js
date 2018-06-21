// @flow
import network from 'api/network'

import { APPLICATIONS_BY_DEVICE } from 'helpers/urls'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getCurrentFirmware from 'helpers/devices/getCurrentFirmware'

export default async (targetId: string | number, version: string) => {
  try {
    const provider = 1
    const deviceData = await getDeviceVersion(targetId)
    const firmwareData = await getCurrentFirmware({ deviceId: deviceData.id, version })
    const params = {
      provider,
      current_se_firmware_final_version: firmwareData.id,
      device_version: deviceData.id,
    }
    const {
      data: { application_versions },
    } = await network({ method: 'POST', url: APPLICATIONS_BY_DEVICE, data: params })
    return application_versions.length > 0 ? application_versions : []
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
