// @flow
import axios from 'axios'

import { GET_FINAL_FIRMWARE } from 'helpers/urls'

export default async (id: number) => {
  try {
    const { data } = await axios.get(`${GET_FINAL_FIRMWARE}/${id}`)
    return data
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
