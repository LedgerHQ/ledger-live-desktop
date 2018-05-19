// @flow

import { handleActions } from 'redux-actions'
import {
  findCurrencyByTicker,
  getFiatCurrencyByTicker,
  listCryptoCurrencies,
} from '@ledgerhq/live-common/lib/helpers/currencies'
import { createSelector } from 'reselect'
import type { InputSelector as Selector } from 'reselect'
import type { CryptoCurrency, Currency, Account } from '@ledgerhq/live-common/lib/types'

import type { Settings, CurrencySettings } from 'types/common'
import type { State } from 'reducers'

export type SettingsState = {
  loaded: boolean, // is the settings loaded from db (it not we don't save them)
  hasCompletedOnboarding: boolean,
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
  developerMode: boolean,
}

/* have to check if available for all OS */
const localeSplit = window.navigator.language.split('-')
const language = (localeSplit[0] || 'en').toLowerCase()
const region = (localeSplit[1] || 'US').toUpperCase()

const CURRENCY_DEFAULTS_SETTINGS: CurrencySettings = {
  confirmationsToSpend: 10,
  minConfirmationsToSpend: 10, // FIXME DROP
  maxConfirmationsToSpend: 50, // FIXME DROP

  confirmationsNb: 10,
  minConfirmationsNb: 10, // FIXME DROP
  maxConfirmationsNb: 50, // FIXME DROP

  transactionFees: 10,

  exchange: '',
}

const state: SettingsState = {
  hasCompletedOnboarding: false,
  counterValue: 'USD',
  language,
  orderAccounts: 'balance|asc',
  password: {
    isEnabled: false,
    value: '',
  },
  marketIndicator: 'western',
  currenciesSettings: {},
  region,
  developerMode: false,
  loaded: false,
}

function asCryptoCurrency(c: Currency): ?CryptoCurrency {
  // $FlowFixMe
  return 'id' in c ? c : null
}

const handlers: Object = {
  SETTINGS_SET_PAIRS: (
    state: SettingsState,
    {
      pairs,
    }: {
      pairs: Array<{
        from: Currency,
        to: Currency,
        exchange: string,
      }>,
    },
  ) => {
    const counterValueCurrency = counterValueCurrencyLocalSelector(state)
    const copy = { ...state }
    copy.currenciesSettings = { ...copy.currenciesSettings }
    for (const { to, from, exchange } of pairs) {
      const fromCrypto = asCryptoCurrency(from)
      if (to === counterValueCurrency && fromCrypto) {
        copy.currenciesSettings[fromCrypto.id] = {
          ...copy.currenciesSettings[fromCrypto.id],
          exchange,
        }
      }
    }
    return copy
  },
  SAVE_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
  }),
  FETCH_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
    loaded: true,
  }),
}

// TODO refactor selectors to *Selector naming convention

export const storeSelector = (state: State): SettingsState => state.settings

export const settingsExportSelector = storeSelector

export const hasPassword = (state: State): boolean => state.settings.password.isEnabled

export const getCounterValueCode = (state: State) => state.settings.counterValue

const counterValueCurrencyLocalSelector = (state: SettingsState): Currency =>
  findCurrencyByTicker(state.counterValue) || getFiatCurrencyByTicker('USD')

export const counterValueCurrencySelector = createSelector(
  storeSelector,
  counterValueCurrencyLocalSelector,
)

export const developerModeSelector = (state: State): boolean => state.settings.developerMode

export const availableCurrencies = createSelector(developerModeSelector, listCryptoCurrencies)

export const getLanguage = (state: State) => state.settings.language

export const localeSelector = (state: State) => {
  const { language, region } = state.settings
  if (!region) {
    return language || 'en'
  }
  return `${language || 'en'}-${region}`
}

export const getOrderAccounts = (state: State) => state.settings.orderAccounts

export const areSettingsLoaded = (state: State) => state.settings.loaded

export const currencySettingsSelector = (
  state: State,
  currency: CryptoCurrency,
): CurrencySettings => {
  const currencySettings = state.settings.currenciesSettings[currency.id]
  return { ...CURRENCY_DEFAULTS_SETTINGS, ...currencySettings }
}

export const currencySettingsForAccountSelector = (
  state: State,
  { account }: { account: Account },
) => currencySettingsSelector(state, account.currency)

type ESFAS = Selector<*, { account: Account }, string>
export const exchangeSettingsForAccountSelector: ESFAS = createSelector(
  currencySettingsForAccountSelector,
  settings => settings.exchange,
)

export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator

export default handleActions(handlers, state)
