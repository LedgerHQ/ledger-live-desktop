// @flow
import invariant from 'invariant'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { blockchainBaseURL } from './Ledger'
import network from './network'

export type Fees = {
  [_: string]: number,
}

export const getEstimatedFees = async (currency: Currency): Promise<Fees> => {
  const baseURL = blockchainBaseURL(currency)
  invariant(baseURL, `Fees for ${currency.id} are not supported`)
  const { data, status } = await network({ method: 'GET', url: `${baseURL}/fees` })
  if (data) {
    return data
  }
  throw new Error(`fee estimation failed. status=${status}`)
}
