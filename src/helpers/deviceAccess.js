// @flow
import createSemaphore from 'semaphore'
import type Transport from '@ledgerhq/hw-transport'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

// all open to device must use openDevice so we can prevent race conditions
// and guarantee we do one device access at a time. It also will handle the .close()
// NOTE optim: in the future we can debounce the close & reuse the same transport instance.

type WithDevice = (devicePath: string) => <T>(job: (Transport<*>) => Promise<T>) => Promise<T>

const semaphorePerDevice = {}

export const withDevice: WithDevice = devicePath => {
  const { FORK_TYPE } = process.env
  if (FORK_TYPE !== 'devices') {
    console.warn(
      `deviceAccess is only expected to be used in process 'devices'. Any other usage may lead to race conditions. (Got: '${FORK_TYPE}')`,
    )
  }
  const sem =
    semaphorePerDevice[devicePath] || (semaphorePerDevice[devicePath] = createSemaphore(1))
  return job =>
    takeSemaphorePromise(sem, async () => {
      const t = await CommNodeHid.open(devicePath)
      try {
        const res = await job(t)
        // $FlowFixMe
        return res
      } finally {
        t.close()
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
