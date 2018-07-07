// @flow
import network from 'api/network'

import { GET_MCUS } from 'helpers/urls'

export default async (): Promise<*> => {
  const { data } = await network({
    method: 'GET',
    url: GET_MCUS,
  })

  return data
}
