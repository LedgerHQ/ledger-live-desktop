import { debounce, delay } from 'helpers/promise'

describe('promise helper', () => {
  describe('debounce', () => {
    test('returns a promise', () => {
      const noop = () => {}
      const debouncedNoop = debounce(noop, 0)
      const res = debouncedNoop()
      expect(res).toBeInstanceOf(Promise)
    })

    test('debounce the call', async () => {
      let num = 0
      const increment = () => (num += 1)
      const debouncedIncrement = debounce(increment, 100)

      debouncedIncrement() // should be cancelled
      await delay(10)
      debouncedIncrement() // should increment
      await delay(100)

      expect(num).toBe(1)
    })

    test('returns the correct promise, for all calls', async () => {
      let num = 0
      const increment = () => (num += 1)
      const debouncedIncrement = debounce(increment, 100)

      const promise1 = debouncedIncrement() // should be cancelled
      debouncedIncrement() // should be cancelled
      debouncedIncrement() // should be cancelled
      debouncedIncrement() // should be cancelled
      debouncedIncrement() // should be cancelled
      debouncedIncrement() // should increment to 1
      await promise1

      expect(num).toBe(1)
    })

    test('forwards error', async () => {
      const failingIncrement = () => {
        throw new Error('nope')
      }
      const debouncedFailingIncrement = debounce(failingIncrement, 100)

      let err
      try {
        await debouncedFailingIncrement()
      } catch (e) {
        err = e
      }
      expect(err).toBeDefined()
      expect(err.message).toBe('nope')
    })
  })
})
