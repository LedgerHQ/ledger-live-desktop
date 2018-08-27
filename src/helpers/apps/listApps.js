// @flow
import network from 'api/network'

import { GET_APPLICATIONS } from 'helpers/urls'
import type { Application } from 'helpers/types'

export default async (): Promise<Array<Application>> => {
  const { data } = await network({ method: 'GET', url: GET_APPLICATIONS })
  return data.length > 0 ? data : []
}
