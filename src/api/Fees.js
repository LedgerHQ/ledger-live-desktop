// @flow
import invariant from 'invariant'
import axios from 'axios'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { blockchainBaseURL, userFriendlyError } from './Ledger'

export type Fees = {
  [_: string]: number,
}

export const getEstimatedFees = async (currency: Currency): Promise<Fees> => {
  const baseURL = blockchainBaseURL(currency)
  invariant(baseURL, `Fees for ${currency.id} are not supported`)
  const { data, status } = await userFriendlyError(axios.get(`${baseURL}/fees`))
  if (data) {
    return data
  }
  throw new Error(`fee estimation failed. status=${status}`)
}
