// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import noop from 'lodash/noop'
import type Transport from '@ledgerhq/hw-transport'

import { APDUS } from 'internals/usb/manager/constants'
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
          const isValid = await isValidHIDDevice(e.device.path)
          if (isValid) {
            send('device.add', e.device, { kill: false })
          }
        }

        if (e.type === 'remove') {
          send('device.remove', e.device, { kill: false })
        }
      },
    })
  },
})

/**
 * Attempt to get firmware infos from device
 * If it fails, we consider it is an invalid device
 */
async function isValidHIDDevice(devicePath: string): Promise<boolean> {
  try {
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    await transport.send(...APDUS.GET_FIRMWARE)
    return true
  } catch (err) {
    return false
  }
}
