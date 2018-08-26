// @flow
import { BigNumber } from 'bignumber.js'
import {
  parseCurrencyUnit,
  getCryptoCurrencyById,
  formatCurrencyUnit,
} from '@ledgerhq/live-common/lib/helpers/currencies'
import { STELLAR_USE_TESTNET } from 'config/constants'
import { Network as StrNetwork, Server as StrServer } from 'stellar-sdk'

const stellarUnit = getCryptoCurrencyById('stellar').units[0]

export const parseAPIValue = (value: string) => {
  if (!value) {
    return new BigNumber(0)
  }
  return parseCurrencyUnit(stellarUnit, `${value}`)
}
export const getServer = (_: any) => {
  if (STELLAR_USE_TESTNET) {
    StrNetwork.useTestNetwork()
    return new StrServer('https://horizon-testnet.stellar.org')
  }
  StrNetwork.usePublicNetwork()
  return new StrServer('https://horizon.stellar.org')
}

export const formatAPICurrencyXLM = (amount: BigNumber) =>
  formatCurrencyUnit(stellarUnit, amount, {
    showAllDigits: true,
    disableRounding: true,
    useGrouping: false,
  })
