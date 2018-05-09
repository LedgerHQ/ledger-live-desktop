// @flow

import axios from 'axios'

import type { IPCSend } from 'types/electron'

export default async (send: IPCSend) => {
  try {
    const { data } = await axios.get('https://api.ledgerwallet.com/update/applications')
    send('manager.listAppsSuccess', data['nanos-1.4'])
  } catch (err) {
    send('manager.listAppsError', { message: err.message, stack: err.stack })
  }
}
