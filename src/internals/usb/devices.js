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
        console.log('e.device', e)
        if (!e.device) {
          return
        }
        if (e.type === 'add') {
          const isValid = await isValidHIDDevice(e.device.path)
          console.log('e.type add isValid', isValid)
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

const wait = async delay => new Promise(resolve => setTimeout(resolve, delay))

/**
 * Attempt to get firmware infos from device
 * If it fails, we consider it is an invalid device
 */
async function isValidHIDDevice(devicePath: string): Promise<boolean> {
  try {
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    console.log('isValidHIDDevice 1')
    try {
      console.log('isValidHIDDevice 2 start')
      await wait(500)
      await transport.send(...APDUS.GET_FIRMWARE)
      console.log('isValidHIDDevice 2 end')
      return true
    } catch (err) {
      console.log('err 1', err)
      // if we are inside an app, the first call should have failed,
      // so we try this one
      console.log('isValidHIDDevice 3 start')
      await wait(500)
      await transport.send(...APDUS.GET_FIRMWARE_FALLBACK)
      console.log('isValidHIDDevice 3 end')
      return true
    }
  } catch (err) {
    console.log('err 2', err)
    return false
  }
}
