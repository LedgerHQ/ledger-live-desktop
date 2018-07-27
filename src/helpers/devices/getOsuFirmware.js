// @flow
import network from 'api/network'

import { GET_CURRENT_OSU } from 'helpers/urls'

type Input = {
  version: string,
  deviceId: string | number,
  provider: string,
}

export default async (input: Input): Promise<*> => {
  const { data } = await network({
    method: 'POST',
    url: GET_CURRENT_OSU,
    data: {
      device_version: input.deviceId,
      version_name: `${input.version}-osu`,
      provider: input.provider,
    },
  })
  return data
}
