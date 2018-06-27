// @flow
import createSemaphore from 'semaphore'
import type Transport from '@ledgerhq/hw-transport'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { DEBUG_DEVICE } from 'config/constants'
import { retry } from './promise'
import { createCustomErrorClass } from './errors'

// all open to device must use openDevice so we can prevent race conditions
// and guarantee we do one device access at a time. It also will handle the .close()
// NOTE optim: in the future we can debounce the close & reuse the same transport instance.

type WithDevice = (devicePath: string) => <T>(job: (Transport<*>) => Promise<T>) => Promise<T>

const semaphorePerDevice = {}

const DisconnectedDevice = createCustomErrorClass('DisconnectedDevice')

const remapError = <T>(p: Promise<T>): Promise<T> =>
  p.catch(e => {
    if (e && e.message && e.message.indexOf('HID') >= 0) {
      throw new DisconnectedDevice(e.message)
    }
    throw e
  })

export const withDevice: WithDevice = devicePath => {
  const sem =
    semaphorePerDevice[devicePath] || (semaphorePerDevice[devicePath] = createSemaphore(1))

  return job =>
    takeSemaphorePromise(sem, devicePath, async () => {
      const t = await retry(() => TransportNodeHid.open(devicePath), { maxRetry: 1 })

      if (DEBUG_DEVICE) t.setDebugMode(true)
      try {
        const res = await remapError(job(t))
        // $FlowFixMe
        return res
      } finally {
        await t.close()
      }
    })
}

function takeSemaphorePromise<T>(sem, devicePath, f: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    sem.take(() => {
      process.send({
        type: 'setDeviceBusy',
        busy: true,
        devicePath,
      })
      f().then(
        r => {
          sem.leave()
          resolve(r)
          process.send({
            type: 'setDeviceBusy',
            busy: false,
            devicePath,
          })
        },
        e => {
          sem.leave()
          reject(e)
          process.send({
            type: 'setDeviceBusy',
            busy: false,
            devicePath,
          })
        },
      )
    })
  })
}
