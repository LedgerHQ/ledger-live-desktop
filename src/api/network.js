// @flow
import axios from 'axios'
import { GET_CALLS_RETRY, GET_CALLS_TIMEOUT } from 'config/constants'
import { retry } from 'helpers/promise'
import logger from 'logger'
import createCustomErrorClass from 'helpers/createCustomErrorClass'

export const LedgerAPIErrorWithMessage = createCustomErrorClass('LedgerAPIErrorWithMessage')
export const LedgerAPIError = createCustomErrorClass('LedgerAPIError')
export const NetworkDown = createCustomErrorClass('NetworkDown')

const userFriendlyError = <A>(p: Promise<A>): Promise<A> =>
  p.catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data } = error.response
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
            throw new LedgerAPIErrorWithMessage(msg)
          }
        }
      }
      const { status } = error.response
      logger.log('Ledger API: HTTP status', status, 'data: ', error.response.data)
      throw new LedgerAPIError(`LedgerAPIError ${status}`, { status })
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
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
  return userFriendlyError(promise)
}

export const setImplementation = (impl: *) => {
  implementation = impl
}

export default (arg: Object) => implementation(arg)
