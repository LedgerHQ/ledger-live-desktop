// @flow
import logger from 'logger'
import throttle from 'lodash/throttle'
import type Transport from '@ledgerhq/hw-transport'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { DELAY_DEVICE_ACCESS, DELAY_DEVICE_OPEN } from 'config/constants'
import { DisconnectedDevice, CantOpenDevice } from 'config/errors'
import { retry, delay } from './promise'

// all open to device must use openDevice so we can prevent race conditions
// and guarantee we do one device access at a time. It also will handle the .close()
// NOTE optim: in the future we can debounce the close & reuse the same transport instance.

type WithDevice = (devicePath: string) => <T>(job: (Transport<*>) => Promise<*>) => Promise<T>

const mapError = e => {
  if (e && e.message && e.message.indexOf('cannot open device with path') >= 0) {
    throw new CantOpenDevice(e.message)
  }
  if (e && e.message && e.message.indexOf('HID') >= 0) {
    throw new DisconnectedDevice(e.message)
  }
  throw e
}

let queue = Promise.resolve()

let busy = false

TransportNodeHid.setListenDevicesPollingSkip(() => busy)

const refreshBusyUIState = throttle(() => {
  process.send({
    type: 'setDeviceBusy',
    busy,
  })
}, 100)

export const withDevice: WithDevice = devicePath => job => {
  const p = queue.then(async () => {
    busy = true
    refreshBusyUIState()
    await delay(DELAY_DEVICE_ACCESS)
    try {
      const t = await retry(() => TransportNodeHid.open(devicePath), { maxRetry: 2 }).catch(
        mapError,
      )
      t.setDebugMode(logger.apdu)
      await delay(DELAY_DEVICE_OPEN)
      try {
        const res = await job(t).catch(mapError)
        return res
      } finally {
        await t.close()
      }
    } finally {
      await delay(DELAY_DEVICE_ACCESS)
      busy = false
      refreshBusyUIState()
    }
  })

  queue = p.catch(() => null)

  return p
}
