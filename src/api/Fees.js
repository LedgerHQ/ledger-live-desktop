// @flow
import axios from 'axios'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { blockchainBaseURL, userFriendlyError } from './Ledger'

export type Fees = {
  [_: string]: number,
}

export const getEstimatedFees = async (currency: Currency): Promise<Fees> => {
  const { data, status } = await userFriendlyError(axios.get(`${blockchainBaseURL(currency)}/fees`))
  if (data) {
    return data
  }
  throw new Error(`fee estimation failed. status=${status}`)
}
