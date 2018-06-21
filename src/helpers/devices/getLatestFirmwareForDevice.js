// @flow
import network from 'api/network'
import { GET_LATEST_FIRMWARE } from 'helpers/urls'

import getCurrentFirmware from './getCurrentFirmware'
import getDeviceVersion from './getDeviceVersion'

type Input = {
  version: string,
  targetId: string | number,
}

export default async (input: Input) => {
  try {
    const provider = 1
    const { targetId, version } = input
    // Get device infos from targetId
    const deviceVersion = await getDeviceVersion(targetId)

    // Get firmware infos with firmware name and device version
    const seFirmwareVersion = await getCurrentFirmware({ version, deviceId: deviceVersion.id })

    // Fetch next possible firmware
    const { data } = await network({
      method: 'POST',
      url: GET_LATEST_FIRMWARE,
      data: {
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id,
        provider,
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
