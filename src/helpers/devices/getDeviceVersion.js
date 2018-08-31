// @flow
import { GET_DEVICE_VERSION } from 'helpers/urls'
import network from 'api/network'

import type { DeviceVersion } from 'helpers/types'

export default async (targetId: string | number, provider: number): Promise<DeviceVersion> => {
  const { data }: { data: DeviceVersion } = await network({
    method: 'POST',
    url: GET_DEVICE_VERSION,
    data: {
      provider,
      target_id: targetId,
    },
  })
  return data
}
