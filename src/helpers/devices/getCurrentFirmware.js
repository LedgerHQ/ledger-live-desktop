// @flow
import network from 'api/network'

import { GET_CURRENT_FIRMWARE } from 'helpers/urls'

type Input = {
  version: string,
  deviceId: string | number,
}

let error
export default async (input: Input): Promise<*> => {
  try {
    const provider = 1
    const { data } = await network({
      method: 'POST',
      url: GET_CURRENT_FIRMWARE,
      data: {
        device_version: input.deviceId,
        version_name: input.version,
        provider,
      },
    })
    return data
  } catch (err) {
    error = Error(err.message)
    error.stack = err.stack
    throw error
  }
}
