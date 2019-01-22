// @flow
import invariant from 'invariant'
import LRU from 'lru-cache'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { FeeEstimationFailed } from '@ledgerhq/errors'
import { blockchainBaseURL } from './Ledger'
import network from './network'

export type Fees = {
  [_: string]: number,
}

const cache = LRU({
  maxAge: 5 * 60 * 1000,
})

export const getEstimatedFees = async (currency: Currency): Promise<Fees> => {
  const key = currency.id
  let promise = cache.get(key)
  if (promise) return promise.then(r => r.data)
  const baseURL = blockchainBaseURL(currency)
  invariant(baseURL, `Fees for ${currency.id} are not supported`)
  promise = network({ method: 'GET', url: `${baseURL}/fees` })
  cache.set(key, promise)
  const { data, status } = await promise
  if (status < 200 || status >= 300) cache.del(key)
  if (data) {
    return data
  }
  throw new FeeEstimationFailed(`FeeEstimationFailed ${status}`, { httpStatus: status })
}
