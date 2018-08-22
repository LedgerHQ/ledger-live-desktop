// @flow
import axios from 'axios'
import { GET_CALLS_RETRY, GET_CALLS_TIMEOUT } from 'config/constants'
import { retry } from 'helpers/promise'
import logger from 'logger'
import { createCustomErrorClass } from 'helpers/errors'
import anonymizer from 'helpers/anonymizer'

export const LedgerAPIErrorWithMessage = createCustomErrorClass('LedgerAPIErrorWithMessage')
export const LedgerAPIError = createCustomErrorClass('LedgerAPIError')
export const NetworkDown = createCustomErrorClass('NetworkDown')

const userFriendlyError = <A>(p: Promise<A>, { url, method, startTime }): Promise<A> =>
  p.catch(error => {
    let errorToThrow
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response
      if (data && typeof data.error === 'string') {
        let msg = data.error || data.message
        if (typeof msg === 'string') {
          const m = msg.match(/^JsDefined\((.*)\)$/)
          const innerPart = m ? m[1] : msg
          try {
            const r = JSON.parse(innerPart)
            let message = r.error
            if (typeof message === 'object') {
              message = message.message
            }
            if (typeof message === 'string') {
              msg = message
            }
          } catch (e) {
            logger.warn("can't parse server result", e)
          }
          if (msg && msg[0] !== '<') {
            errorToThrow = new LedgerAPIErrorWithMessage(msg, {
              status,
              url: anonymizer.url(url),
              method,
            })
          }
        }
      }
      if (!errorToThrow) {
        errorToThrow = new LedgerAPIError(`LedgerAPIError ${status}`, {
          status,
          url: anonymizer.url(url),
          method,
        })
      }
      logger.networkError({
        status,
        url,
        method,
        error: errorToThrow.message,
        responseTime: Date.now() - startTime,
      })
      throw errorToThrow
    } else if (error.request) {
      logger.networkDown({
        url,
        method,
        responseTime: Date.now() - startTime,
      })
      throw new NetworkDown()
    }
    throw error
  })

let implementation = (arg: Object) => {
  let promise
  if (arg.method === 'GET') {
    if (!('timeout' in arg)) {
      arg.timeout = GET_CALLS_TIMEOUT
    }
    promise = retry(() => axios(arg), {
      maxRetry: GET_CALLS_RETRY,
    })
  } else {
    promise = axios(arg)
  }
  const meta = {
    url: arg.url,
    method: arg.method,
    startTime: Date.now(),
  }
  logger.network(meta)
  promise.then(response => {
    logger.networkSucceed({
      ...meta,
      status: response.status,
      responseTime: Date.now() - meta.startTime,
    })
  })
  return userFriendlyError(promise, meta)
}

export const setImplementation = (impl: *) => {
  implementation = impl
}

export default (arg: Object) => implementation(arg)
