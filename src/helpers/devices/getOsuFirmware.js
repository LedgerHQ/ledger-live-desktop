// @flow
import network from 'api/network'

import { GET_CURRENT_OSU } from 'helpers/urls'

type Input = {
  version: string,
  deviceId: string | number,
}

export default async (input: Input): Promise<*> => {
  const provider = 1
  const { data } = await network({
    method: 'POST',
    url: GET_CURRENT_OSU,
    data: {
      device_version: input.deviceId,
      version_name: input.version,
      provider,
    },
  })
  return data
}
