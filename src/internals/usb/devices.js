// @flow

import listenDevices from '@ledgerhq/hw-transport-node-hid/lib/listenDevices'
import getDevices from '@ledgerhq/hw-transport-node-hid/lib/getDevices'

const isLedgerDevice = device =>
  (device.vendorId === 0x2581 && device.productId === 0x3b7c) || device.vendorId === 0x2c97

let isListenDevices = false

export default (send: Function) => ({
  listen: () => {
    if (isListenDevices) {
      return
    }

    isListenDevices = true

    const handleChangeDevice = eventName => device =>
      isLedgerDevice(device) && send(eventName, device, { kill: false })

    listenDevices.start()

    listenDevices.events.on('add', handleChangeDevice('device.add'))
    listenDevices.events.on('remove', handleChangeDevice('device.remove'))
  },
  all: () => send('devices.update', getDevices().filter(isLedgerDevice)),
})
