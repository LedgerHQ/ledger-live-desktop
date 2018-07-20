// @flow
import network from 'api/network'

import { GET_ICONS } from 'helpers/urls'

export default async () => {
  const { data } = await network({ method: 'GET', url: GET_ICONS })
  return data.length > 0 ? data : []
}
