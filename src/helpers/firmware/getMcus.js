// @flow
import network from 'api/network'

import { GET_MCUS } from 'helpers/urls'

export default async (): Promise<*> => {
  try {
    const { data } = await network({
      method: 'GET',
      url: GET_MCUS,
    })

    return data
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
