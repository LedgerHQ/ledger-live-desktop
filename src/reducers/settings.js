// @flow

import { handleActions } from 'redux-actions'
import { findCurrencyByTicker } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { CryptoCurrency, Currency } from '@ledgerhq/live-common/lib/types'

import type { Settings, CurrencySettings } from 'types/common'
import type { State } from 'reducers'

export type SettingsState = {
  hasCompletedOnboarding: boolean,
  username: string,
  counterValue: string,
  language: string,
  orderAccounts: string,
  password: {
    isEnabled: boolean,
    value: string,
  },
  marketIndicator: string,
  currenciesSettings: {
    [currencyId: string]: CurrencySettings,
  },
  region: string,
}

/* have to check if available for all OS */
const language = window.navigator.language.split('-')[0]

const defaultState: SettingsState = {
  hasCompletedOnboarding: false,
  username: 'Anonymous',
  counterValue: 'USD',
  language,
  orderAccounts: 'balance|asc',
  password: {
    isEnabled: false,
    value: '',
  },
  marketIndicator: 'western',
  currenciesSettings: {},
  region: 'US',
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

// TODO refactor selectors to *Selector naming convention

export const hasPassword = (state: State): boolean => state.settings.password.isEnabled

export const getCounterValueCode = (state: State) => state.settings.counterValue

export const counterValueCurrencySelector = (state: State): ?Currency =>
  findCurrencyByTicker(getCounterValueCode(state))

export const getLanguage = (state: State) => state.settings.language

export const getOrderAccounts = (state: State) => state.settings.orderAccounts

export const currencySettingsSelector = (
  state: State,
  currency: CryptoCurrency,
): CurrencySettings => {
  const currencySettings = state.settings.currenciesSettings[currency.id]
  return { ...CURRENCY_DEFAULTS_SETTINGS, ...currencySettings }
}

export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator

export default handleActions(handlers, state)
