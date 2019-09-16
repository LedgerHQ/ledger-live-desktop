import { delay } from 'helpers/promise'

// Wait for an element to be present then continue
export function waitForExpectedText(app, selector, expected, maxRetry = 5) {
  async function check() {
    if (!maxRetry) {
      throw new Error(`Cant find the element ${selector} in the page`)
    }
    try {
      const str = await app.client.getText(selector)
      if (str === expected || str.startsWith(expected)) {
        return true
      }
    } catch (err) {} // eslint-disable-line
    await delay(500)
    --maxRetry
    return check()
  }
  return check()
}

// Wait for an element to disappear then continue
export function waitForDisappear(app, selector, maxRetry = 10) {
  async function check() {
    if (!maxRetry) {
      throw new Error('Too many retries for waiting element to disappear')
    }
    try {
      await app.client.getText(selector)
    } catch (err) {
      if (err.message.startsWith('An element could not be located')) {
        return true
      }
    }
    await delay(500)
    --maxRetry
    return check()
  }
  return check()
}
