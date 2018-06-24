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

export function createCancelablePolling(pollingMs: number, job: any => Promise<any>) {
  let isUnsub = false
  const unsubscribe = () => (isUnsub = true)
  const getUnsub = () => isUnsub
  const promise = new Promise(resolve => {
    async function poll() {
      if (getUnsub()) return
      try {
        const res = await job()
        resolve(res)
      } catch (err) {
        await delay(pollingMs)
        poll()
      }
    }
    poll()
  })
  return { unsubscribe, promise }
}
