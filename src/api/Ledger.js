// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'

const BASE_URL = process.env.LEDGER_REST_API_BASE || 'https://api.ledgerwallet.com/'

const mapping = {
  bitcoin_cash: 'abc',
  ethereum_classic: 'ethc',
  ethereum_testnet: 'eth_testnet',
}

export const currencyToFeeTicker = (currency: Currency) => {
  const tickerLowerCase = currency.ticker.toLowerCase()
  return mapping[currency.id] || tickerLowerCase
}

export const blockchainBaseURL = (currency: Currency) =>
  `${BASE_URL}blockchain/v2/${currencyToFeeTicker(currency)}`
