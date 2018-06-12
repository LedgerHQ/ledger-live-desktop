// @flow
import axios from 'axios'
import { GET_CALLS_RETRY, GET_CALLS_TIMEOUT } from 'config/constants'
import { userFriendlyError } from 'api/Ledger'
import { retry } from 'helpers/promise'

const doRequest = axios // TODO later introduce a way to run it in renderer based on a env, we will diverge this implementation

export default (arg: Object) => {
  let promise
  if (arg.method === 'GET') {
    if (!('timeout' in arg)) {
      arg.timeout = GET_CALLS_TIMEOUT
    }
    promise = retry(() => doRequest(arg), {
      maxRetry: GET_CALLS_RETRY,
    })
  } else {
    promise = doRequest(arg)
  }
  return userFriendlyError(promise)
}
