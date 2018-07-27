// @flow
import network from 'api/network'

import { GET_CURRENT_FIRMWARE } from 'helpers/urls'

type Input = {
  seVersion: string,
  deviceId: string | number,
  provider: string,
}

export default async (input: Input): Promise<*> => {
  const { data } = await network({
    method: 'POST',
    url: GET_CURRENT_FIRMWARE,
    data: {
      device_version: input.deviceId,
      version_name: input.seVersion,
      provider: input.provider,
    },
  })
  return data
}
