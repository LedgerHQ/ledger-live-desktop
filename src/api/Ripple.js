// @flow
import logger from 'logger'
import { RippleAPI } from 'ripple-lib'
import {
  parseCurrencyUnit,
  getCryptoCurrencyById,
  formatCurrencyUnit,
} from '@ledgerhq/live-common/lib/helpers/currencies'

const rippleUnit = getCryptoCurrencyById('ripple').units[0]

export const defaultEndpoint = 'wss://s2.ripple.com'

export const apiForEndpointConfig = (endpointConfig: ?string = null) => {
  const server = endpointConfig || defaultEndpoint
  const api = new RippleAPI({ server })
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
