// @flow
import network from 'api/network'

import { GET_APPLICATIONS } from 'helpers/urls'

export default async () => {
  const { data } = await network({ method: 'GET', url: GET_APPLICATIONS })
  return data.length > 0 ? data : []
}
