// @flow
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'

import { API_BASE_URL } from 'helpers/constants'

type Input = {
  version: string,
  targetId: string | number,
}

let error
export default async (data: Input) => {
  try {
    const { data: seFirmwareVersion } = await axios.post(`${API_BASE_URL}/firmware_versions_name`, {
      se_firmware_name: data.version,
      target_id: data.targetId,
    })

    if (!isEmpty(seFirmwareVersion)) {
      return seFirmwareVersion
    }

    error = Error('could not retrieve firmware informations, try again later')
    throw error
  } catch (err) {
    error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
