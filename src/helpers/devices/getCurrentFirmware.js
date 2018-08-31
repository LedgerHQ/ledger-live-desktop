// @flow
import network from 'api/network'

import { GET_CURRENT_FIRMWARE } from 'helpers/urls'
import type { FinalFirmware } from 'helpers/types'

type Input = {
  fullVersion: string,
  deviceId: string | number,
  provider: number,
}

export default async (input: Input): Promise<FinalFirmware> => {
  const { data }: { data: FinalFirmware } = await network({
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
