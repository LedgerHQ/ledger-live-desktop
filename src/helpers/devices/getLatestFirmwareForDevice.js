// @flow
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'

import getFirmwareInfo from './getFirmwareInfo'

const { API_BASE_URL } = process.env

type Input = {
  targetId: string | number,
  version: string,
}

export default async (data: Input) => {
  try {
    // Get firmware infos with firmware name and device version
    const seFirmwareVersion = await getFirmwareInfo(data)

    // Get device infos from targetId
    const { data: deviceVersion } = await axios.get(
      `${API_BASE_URL}/device_versions_target_id/${data.targetId}`,
    )

    // Fetch next possible firmware
    const { data: serverData } = await axios.post(`${API_BASE_URL}/get_latest_firmware`, {
      current_se_firmware_version: seFirmwareVersion.id,
      device_version: deviceVersion.id,
      providers: [1],
    })

    const { se_firmware_version } = serverData

    if (!isEmpty(se_firmware_version)) {
      return se_firmware_version
    }

    return null
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
