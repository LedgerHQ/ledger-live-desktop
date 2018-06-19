// @flow
import axios from 'axios'

import { GET_DEVICE_VERSION } from 'helpers/urls'

export default async (targetId: string | number): Promise<*> => {
  try {
    const provider = 1
    const { data } = await axios.post(GET_DEVICE_VERSION, {
      provider,
      target_id: targetId,
    })
    return data
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
