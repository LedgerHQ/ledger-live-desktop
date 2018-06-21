// @flow
import { GET_DEVICE_VERSION } from 'helpers/urls'
import network from 'api/network'

export default async (targetId: string | number): Promise<*> => {
  const provider = 1
  const { data } = await network({
    method: 'POST',
    url: GET_DEVICE_VERSION,
    data: {
      provider,
      target_id: targetId,
    },
  })
  return data
}
