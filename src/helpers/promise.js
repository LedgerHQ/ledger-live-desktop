// @flow
// small utilities for Promises

import logger from 'logger'

export const delay = (ms: number): Promise<void> => new Promise(f => setTimeout(f, ms))

const defaults = {
  maxRetry: 4,
  interval: 300,
  intervalMultiplicator: 1.5,
}
export function retry<A>(f: () => Promise<A>, options?: $Shape<typeof defaults>): Promise<A> {
  const { maxRetry, interval, intervalMultiplicator } = { ...defaults, ...options }

  return rec(maxRetry, interval)

  function rec(remainingTry, interval) {
    const result = f()
    if (remainingTry <= 0) {
      return result
    }
    // In case of failure, wait the interval, retry the action
    return result.catch(e => {
      logger.warn('retry failed', e.message)
      return delay(interval).then(() => rec(remainingTry - 1, interval * intervalMultiplicator))
    })
  }
}

export function idleCallback() {
  return new Promise(resolve => window.requestIdleCallback(resolve))
}

type CancellablePollingOpts = {
  pollingInterval?: number,
  shouldThrow?: Error => boolean,
}

export function createCancelablePolling(
  job: any => Promise<any>,
  { pollingInterval = 500, shouldThrow }: CancellablePollingOpts = {},
) {
  let isUnsub = false
  const unsubscribe = () => (isUnsub = true)
  const getUnsub = () => isUnsub
  const promise = new Promise((resolve, reject) => {
    async function poll() {
      try {
        const res = await job()
        if (getUnsub()) return
        resolve(res)
      } catch (err) {
        if (shouldThrow && shouldThrow(err)) {
          reject(err)
          return
        }
        await delay(pollingInterval)
        if (getUnsub()) return
        poll()
      }
    }
    poll()
  })
  return { unsubscribe, promise }
}

export const promisify = (fn: any) => (...args: any) =>
  new Promise((resolve, reject) =>
    fn(...args, (err: Error, res: any) => {
      if (err) return reject(err)
      return resolve(res)
    }),
  )
