// @flow
import createSemaphore from 'semaphore'
import type Transport from '@ledgerhq/hw-transport'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { DEBUG_DEVICE } from 'config/constants'
import { retry } from './promise'

// all open to device must use openDevice so we can prevent race conditions
// and guarantee we do one device access at a time. It also will handle the .close()
// NOTE optim: in the future we can debounce the close & reuse the same transport instance.

type WithDevice = (devicePath: string) => <T>(job: (Transport<*>) => Promise<T>) => Promise<T>

const semaphorePerDevice = {}

export const withDevice: WithDevice = devicePath => {
  const sem =
    semaphorePerDevice[devicePath] || (semaphorePerDevice[devicePath] = createSemaphore(1))

  return job =>
    takeSemaphorePromise(sem, async () => {
      const t = await retry(() => TransportNodeHid.open(devicePath), { maxRetry: 1 })

      if (DEBUG_DEVICE) t.setDebugMode(true)
      try {
        const res = await job(t)
        // $FlowFixMe
        return res
      } finally {
        await t.close()
      }
    })
}

function takeSemaphorePromise<T>(sem, f: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    sem.take(() => {
      f().then(
        r => {
          sem.leave()
          resolve(r)
        },
        e => {
          sem.leave()
          reject(e)
        },
      )
    })
  })
}
