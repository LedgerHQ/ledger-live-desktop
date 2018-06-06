// @flow
import logger from 'logger'
import { RippleAPI } from 'ripple-lib'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import {
  parseCurrencyUnit,
  getCryptoCurrencyById,
  formatCurrencyUnit,
} from '@ledgerhq/live-common/lib/helpers/currencies'

const rippleUnit = getCryptoCurrencyById('ripple').units[0]

const apiEndpoint = {
  ripple: 'wss://s1.ripple.com',
}

export const apiForCurrency = (currency: CryptoCurrency) => {
  const api = new RippleAPI({
    server: apiEndpoint[currency.id],
  })
  api.on('error', (errorCode, errorMessage) => {
    logger.warn(`Ripple API error: ${errorCode}: ${errorMessage}`)
  })
  return api
}

export const parseAPIValue = (value: string) => parseCurrencyUnit(rippleUnit, value)

export const parseAPICurrencyObject = ({
  currency,
  value,
}: {
  currency: string,
  value: string,
}) => {
  if (currency !== 'XRP') {
    logger.warn(`RippleJS: attempt to parse unknown currency ${currency}`)
    return 0
  }
  return parseAPIValue(value)
}

export const formatAPICurrencyXRP = (amount: number) => {
  const value = formatCurrencyUnit(rippleUnit, amount, {
    showAllDigits: true,
    disableRounding: true,
  })
  return { currency: 'XRP', value }
}
