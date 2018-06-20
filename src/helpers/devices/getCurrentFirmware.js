// @flow
import axios from 'axios'

import { GET_CURRENT_FIRMWARE } from 'helpers/urls'

type Input = {
  version: string,
  deviceId: string | number,
}

let error
export default async (input: Input): Promise<*> => {
  try {
    const provider = 1
    const { data } = await axios.post(GET_CURRENT_FIRMWARE, {
      device_version: input.deviceId,
      version_name: input.version,
      provider,
    })
    return data
  } catch (err) {
    error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
