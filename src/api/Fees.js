// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { get } from './Ledger'

const mapping = {
  bch: 'abc',
}
const currencyToFeeTicker = (currency: Currency) => {
  const tickerLowerCase = currency.ticker.toLowerCase()
  return mapping[tickerLowerCase] || tickerLowerCase
}

export type Fees = {
  [_: string]: number,
}

export const getEstimatedFees = async (currency: Currency): Promise<Fees> => {
  const { data, status } = await get(`blockchain/v2/${currencyToFeeTicker(currency)}/fees`)
  if (data) {
    return data
  }
  throw new Error(`fee estimation failed. status=${status}`)
}
