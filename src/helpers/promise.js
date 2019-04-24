// @flow
// small utilities for Promises

import logger from 'logger'
import { TimeoutTagged } from '@ledgerhq/errors'
import { genericCanRetryOnError } from '@ledgerhq/live-common/lib/hw/deviceAccess'

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

export function idleCallback(): Promise<any> {
  return new Promise(resolve => window.requestIdleCallback(resolve))
}

type CancellablePollingOpts = {
  pollingInterval?: number,
}

export function createCancelablePolling(
  job: any => Promise<any>,
  { pollingInterval = 1250 }: CancellablePollingOpts = {},
) {
  let isUnsub = false
  const unsubscribe = () => (isUnsub = true)
  const getUnsub = () => isUnsub
  const promise: Promise<any> = new Promise((resolve, reject) => {
    async function poll() {
      try {
        const res = await job()
        if (getUnsub()) return
        resolve(res)
      } catch (err) {
        if (!genericCanRetryOnError(err)) {
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

export const timeoutTagged = <T>(tag: string, delay: number, promise: Promise<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new TimeoutTagged('timeout', { tag }))
    }, delay)
    promise.then(
      r => {
        clearTimeout(timeout)
        resolve(r)
      },
      e => {
        clearTimeout(timeout)
        reject(e)
      },
    )
  })

export const promisify = (fn: any) => (...args: any): Promise<any> =>
  new Promise((resolve, reject) =>
    fn(...args, (err: Error, res: any) => {
      if (err) return reject(err)
      return resolve(res)
    }),
  )

export const debounce = (fn: any => any, ms: number) => {
  let timeout
  let resolveRefs = []
  let rejectRefs = []
  return (...args: any) => {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      resolveRefs.push(resolve)
      rejectRefs.push(reject)
    })
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(async () => {
      try {
        const res = await fn(...args)
        resolveRefs.forEach(r => r(res))
      } catch (err) {
        rejectRefs.forEach(r => r(err))
      }
      resolveRefs = []
      rejectRefs = []
    }, ms)
    return promise
  }
}
