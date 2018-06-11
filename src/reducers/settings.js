// @flow

import { handleActions } from 'redux-actions'
import {
  findCurrencyByTicker,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from '@ledgerhq/live-common/lib/helpers/currencies'
import { listCryptoCurrencies } from 'config/cryptocurrencies'
import languages from 'config/languages'
import { createSelector } from 'reselect'
import type { InputSelector as Selector } from 'reselect'
import type { CryptoCurrency, Currency, Account } from '@ledgerhq/live-common/lib/types'
import { currencySettingsDefaults } from 'helpers/SettingsDefaults'

import type { CurrencySettings } from 'types/common'
import type { State } from 'reducers'

export const intermediaryCurrency = getCryptoCurrencyById('bitcoin')

export type SettingsState = {
  loaded: boolean, // is the settings loaded from db (it not we don't save them)
  hasCompletedOnboarding: boolean,
  counterValue: string,
  counterValueExchange: ?string,
  language: string,
  orderAccounts: string,
  password: {
    isEnabled: boolean,
    value: string,
  },
  marketIndicator: 'eastern' | 'western',
  currenciesSettings: {
    [currencyId: string]: CurrencySettings,
  },
  region: string,
  developerMode: boolean,
  shareAnalytics: boolean,
  sentryLogs: boolean,
}

/* have to check if available for all OS */
const localeSplit = (window.navigator.language || '').split('-')
let language = (localeSplit[0] || 'en').toLowerCase()
let region = (localeSplit[1] || 'US').toUpperCase()
if (!languages.includes(language)) {
  language = 'en'
  region = 'US'
}

const defaultsForCurrency: CryptoCurrency => CurrencySettings = crypto => {
  const defaults = currencySettingsDefaults(crypto)
  return {
    confirmationsNb: defaults.confirmationsNb ? defaults.confirmationsNb.def : 0,
    exchange: '',
  }
}

const INITIAL_STATE: SettingsState = {
  hasCompletedOnboarding: false,
  counterValue: 'USD',
  counterValueExchange: null,
  language,
  orderAccounts: 'balance|asc',
  password: {
    isEnabled: false,
    value: '',
  },
  marketIndicator: 'western',
  currenciesSettings: {},
  region,
  developerMode: !!process.env.__DEV__,
  loaded: false,
  shareAnalytics: false,
  sentryLogs: false,
}

function asCryptoCurrency(c: Currency): ?CryptoCurrency {
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
      if (fromCrypto && to.ticker === intermediaryCurrency.ticker) {
        copy.currenciesSettings[fromCrypto.id] = {
          ...copy.currenciesSettings[fromCrypto.id],
          exchange,
        }
      } else if (
        from.ticker === intermediaryCurrency.ticker &&
        to.ticker === counterValueCurrency.ticker
      ) {
        copy.counterValueExchange = exchange
      }
    }
    return copy
  },
  SAVE_SETTINGS: (
    state: SettingsState,
    { payload: settings }: { payload: $Shape<SettingsState> },
  ) => ({
    ...state,
    ...settings,
    developerMode: settings.developerMode || !!process.env.__DEV__,
  }),
  FETCH_SETTINGS: (
    state: SettingsState,
    { payload: settings }: { payload: $Shape<SettingsState> },
  ) => ({
    ...state,
    ...settings,
    developerMode: settings.developerMode || !!process.env.__DEV__,
    loaded: true,
  }),
}

// TODO refactor selectors to *Selector naming convention

export const storeSelector = (state: State): SettingsState => state.settings

export const settingsExportSelector = storeSelector

export const hasPassword = (state: State): boolean => state.settings.password.isEnabled

export const getCounterValueCode = (state: State) => state.settings.counterValue

export const counterValueCurrencyLocalSelector = (state: SettingsState): Currency =>
  findCurrencyByTicker(state.counterValue) || getFiatCurrencyByTicker('USD')

export const counterValueCurrencySelector = createSelector(
  storeSelector,
  counterValueCurrencyLocalSelector,
)

export const counterValueExchangeLocalSelector = (s: SettingsState) => s.counterValueExchange

export const counterValueExchangeSelector = createSelector(
  storeSelector,
  counterValueExchangeLocalSelector,
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

export const currencySettingsLocaleSelector = (
  settings: SettingsState,
  currency: Currency,
): CurrencySettings => {
  const currencySettings = settings.currenciesSettings[currency.id]
  return { ...defaultsForCurrency(currency), ...currencySettings }
}

type CSS = Selector<*, { currency: CryptoCurrency }, CurrencySettings>

export const currencyPropExtractor = (_: *, { currency }: *) => currency

export const currencySettingsSelector: CSS = createSelector(
  storeSelector,
  currencyPropExtractor,
  currencySettingsLocaleSelector,
)

export const currencySettingsForAccountSelector = (
  state: State,
  { account }: { account: Account },
) => currencySettingsSelector(state, { currency: account.currency })

type ESFAS = Selector<*, { account: Account }, ?string>
export const exchangeSettingsForAccountSelector: ESFAS = createSelector(
  currencySettingsForAccountSelector,
  settings => settings.exchange,
)

export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator

export default handleActions(handlers, INITIAL_STATE)
