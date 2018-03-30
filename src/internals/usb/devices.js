// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import noop from 'lodash/noop'

import type { IPCSend } from 'types/electron'

export default (send: IPCSend) => ({
  listen: () => {
    CommNodeHid.listen({
      error: noop,
      complete: noop,
      next: async e => {
        if (!e.device) {
          return
        }

        if (e.type === 'add') {
          send('device.add', e.device, { kill: false })
        }

        if (e.type === 'remove') {
          send('device.remove', e.device, { kill: false })
        }
      },
    })
  },
})
