// @flow
import network from 'api/network'

import { GET_CURRENT_FIRMWARE } from 'helpers/urls'

type Input = {
  fullVersion: string,
  deviceId: string | number,
  provider: number,
}

export default async (input: Input): Promise<*> => {
  const { data } = await network({
    method: 'POST',
    url: GET_CURRENT_FIRMWARE,
    data: {
      device_version: input.deviceId,
      version_name: input.fullVersion,
      provider: input.provider,
    },
  })
  return data
}
