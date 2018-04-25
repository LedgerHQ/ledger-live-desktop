// @flow

import { handleActions } from 'redux-actions'
import { getFiatUnit } from '@ledgerhq/currencies'
import type { Currency } from '@ledgerhq/currencies'

import get from 'lodash/get'

import type { Settings, CurrencySettings } from 'types/common'
import type { State } from 'reducers'

export type SettingsState = Object

const defaultState: SettingsState = {
  username: 'Anonymous',
  counterValue: 'USD',
  language: 'en',
  orderAccounts: 'balance|asc',
  password: {
    isEnabled: false,
    value: '',
  },
  marketIndicator: 'western',
  currenciesSettings: {},
  region: { key: 'US', name: 'United States' },
}

const CURRENCY_DEFAULTS_SETTINGS: CurrencySettings = {
  confirmationsToSpend: 10,
  minConfirmationsToSpend: 10,
  maxConfirmationsToSpend: 50,

  confirmationsNb: 10,
  minConfirmationsNb: 10,
  maxConfirmationsNb: 50,

  transactionFees: 10,
}

const state: SettingsState = {
  ...defaultState,
}

const handlers: Object = {
  SAVE_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
  }),
  FETCH_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
  }),
}

export const hasPassword = (state: Object) =>
  get(state.settings, 'password.isEnabled', defaultState.password.isEnabled)

export const getCounterValueCode = (state: Object) =>
  get(state.settings, 'counterValue', defaultState.counterValue)

export const getCounterValueFiatUnit = (state: Object) => getFiatUnit(getCounterValueCode(state))

export const getLanguage = (state: Object) => get(state.settings, 'language', defaultState.language)

export const getOrderAccounts = (state: Object) =>
  get(state.settings, 'orderAccounts', defaultState.orderAccounts)

export const currencySettingsSelector = (state: State, currency: Currency): CurrencySettings => {
  const currencySettings = state.settings.currenciesSettings[currency.coinType]
  return currencySettings || CURRENCY_DEFAULTS_SETTINGS
}

export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator

export default handleActions(handlers, state)
