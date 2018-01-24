// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

export default (send: Function) => ({
  listen: () => {
    CommNodeHid.listen({
      next: e => {
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
