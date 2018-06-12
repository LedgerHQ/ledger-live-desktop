// @flow
import axios from 'axios'
import { GET_CALLS_RETRY, GET_CALLS_TIMEOUT } from 'config/constants'
import { userFriendlyError } from 'api/Ledger'
import { retry } from 'helpers/promise'

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
