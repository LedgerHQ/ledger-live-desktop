// @flow

import axios from 'axios'

export default async () => {
  try {
    const { data } = await axios.get('https://api.ledgerwallet.com/update/applications')
    return data['nanos-1.4']
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
