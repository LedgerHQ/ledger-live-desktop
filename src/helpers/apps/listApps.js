// @flow
import axios from 'axios'

import {
  DEVICE_VERSION_BY_TARGET_ID,
  APPLICATIONS_BY_DEVICE,
  FIRMWARE_FINAL_VERSIONS_NAME,
} from 'helpers/urls'

export default async (targetId: string | number, version: string) => {
  try {
    const provider = 1
    const { data: deviceData } = await axios.post(DEVICE_VERSION_BY_TARGET_ID, {
      provider,
      target_id: targetId,
    })
    const { data: firmwareData } = await axios.post(FIRMWARE_FINAL_VERSIONS_NAME, {
      device_version: deviceData.id,
      se_firmware_name: version,
    })
    const {
      data: { application_versions },
    } = await axios.post(APPLICATIONS_BY_DEVICE, {
      providers: [1],
      current_se_firmware_final_version: firmwareData.id,
      device_version: deviceData.id,
    })
    return application_versions.length > 0 ? application_versions : []
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
