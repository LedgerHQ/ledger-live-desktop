// @flow
import axios from 'axios'
import { GET_CALLS_RETRY, GET_CALLS_TIMEOUT } from 'config/constants'
import { retry } from 'helpers/promise'
import logger from 'logger'
import { NetworkDown, LedgerAPI5xx, LedgerAPI4xx } from '@ledgerhq/errors'
import anonymizer from 'helpers/anonymizer'

const makeError = (msg, status, url, method) => {
  const obj = {
    status,
    url,
    method,
  }
  return (status || '').toString().startsWith('4')
    ? new LedgerAPI4xx(msg, obj)
    : new LedgerAPI5xx(msg, obj)
}

const extractErrorMessage = (raw: string): ?string => {
  try {
    let data = JSON.parse(raw)
    if (data && Array.isArray(data)) data = data[0]
    let msg = data.error || data.message || data.error_message || data.msg
    if (typeof msg === 'string') {
      const m = msg.match(/^JsDefined\((.*)\)$/)
      const innerPart = m ? m[1] : msg
      try {
        const r = JSON.parse(innerPart)
        let message = r.message
        if (typeof message === 'object') {
          message = message.message
        }
        if (typeof message === 'string') {
          msg = message
        }
      } catch (e) {
        logger.warn("can't parse server result", e)
      }
      return msg ? String(msg) : null
    }
  } catch (e) {
    logger.warn("can't parse server result", e)
  }
  return null
}

const userFriendlyError = <A>(p: Promise<A>, { url, method, startTime, ...rest }): Promise<A> =>
  p.catch(error => {
    let errorToThrow
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response
      let msg
      if (data && typeof data === 'string') {
        msg = extractErrorMessage(data)
      }
      if (msg) {
        errorToThrow = makeError(msg, status, anonymizer.url(url), method)
      } else {
        errorToThrow = makeError(`API HTTP ${status}`, status, anonymizer.url(url), method)
      }
      logger.networkError({
        ...rest,
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
    // $FlowFixMe
    promise = retry(() => axios(arg), {
      maxRetry: GET_CALLS_RETRY,
    })
  } else {
    // $FlowFixMe
    promise = axios(arg)
  }
  const meta = {
    url: arg.url,
    method: arg.method,
    data: arg.data,
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
