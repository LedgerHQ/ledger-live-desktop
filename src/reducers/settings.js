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
  region: { key: string, name: string }, // FIXME need to only store the key because imagine there is a typo in name in the future. it is derivated data
}

const defaultState: SettingsState = {
  hasCompletedOnboarding: false,
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
