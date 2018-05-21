// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'

const BASE_URL = process.env.LEDGER_REST_API_BASE || 'https://api.ledgerwallet.com/'

const mapping = {
  bch: 'abc',
  etc: 'ethc',
}

export const currencyToFeeTicker = (currency: Currency) => {
  const tickerLowerCase = currency.ticker.toLowerCase()
  return mapping[tickerLowerCase] || tickerLowerCase
}

export const blockchainBaseURL = (currency: Currency) =>
  `${BASE_URL}blockchain/v2/${currencyToFeeTicker(currency)}`
