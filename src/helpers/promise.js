// @flow

// small utilities for Promises

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
      console.warn('Promise#retry', e)
      return delay(interval).then(() => rec(remainingTry - 1, interval * intervalMultiplicator))
    })
  }
}
