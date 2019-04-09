// @flow

import { handleActions } from 'redux-actions'
import {
  findCurrencyByTicker,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from '@ledgerhq/live-common/lib/currencies'
import languages from 'config/languages'
import { createSelector } from 'reselect'
import type { InputSelector as Selector } from 'reselect'
import type { CryptoCurrency, Currency, Account } from '@ledgerhq/live-common/lib/types'
import { currencySettingsDefaults } from 'helpers/SettingsDefaults'
import { getSystemLocale } from 'helpers/systemLocale'

import type { CurrencySettings } from 'types/common'
import type { State } from 'reducers'

export const intermediaryCurrency = getCryptoCurrencyById('bitcoin')

export const timeRangeDaysByKey = {
  week: 7,
  month: 30,
  year: 365,
}

export type TimeRange = $Keys<typeof timeRangeDaysByKey>

export type { CurrencySettings }

export type SettingsState = {
  loaded: boolean, // is the settings loaded from db (it not we don't save them)
  hasCompletedOnboarding: boolean,
  counterValue: string,
  counterValueExchange: ?string,
  language: ?string,
  region: ?string,
  orderAccounts: string,
  hasPassword: boolean,
  autoLockTimeout: number,
  selectedTimeRange: TimeRange,
  marketIndicator: 'eastern' | 'western',
  currenciesSettings: {
    [currencyId: string]: CurrencySettings,
  },
  developerMode: boolean,
  shareAnalytics: boolean,
  sentryLogs: boolean,
  lastUsedVersion: string,
  dismissedBanners: string[],
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
  language: null,
  region: null,
  orderAccounts: 'balance|asc',
  hasPassword: false,
  autoLockTimeout: 10,
  selectedTimeRange: 'month',
  marketIndicator: 'western',
  currenciesSettings: {},
  developerMode: !!process.env.__DEV__,
  loaded: false,
  shareAnalytics: true,
  sentryLogs: true,
  lastUsedVersion: __APP_VERSION__,
  dismissedBanners: [],
}

function asCryptoCurrency(c: Currency): ?CryptoCurrency {
  // $FlowFixMe
  return 'coinType' in c ? c : null
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
  }),
  FETCH_SETTINGS: (
    state: SettingsState,
    { payload: settings }: { payload: $Shape<SettingsState> },
  ) => ({
    ...state,
    ...settings,
    loaded: true,
  }),
  SETTINGS_DISMISS_BANNER: (state: SettingsState, { payload: bannerId }) => ({
    ...state,
    dismissedBanners: [...state.dismissedBanners, bannerId],
  }),
  CLEAN_ACCOUNTS_CACHE: (state: SettingsState) => ({
    ...state,
    dismissedBanners: [],
  }),
}

// TODO refactor selectors to *Selector naming convention

export const storeSelector = (state: State): SettingsState => state.settings

export const settingsExportSelector = storeSelector

export const hasPasswordSelector = (state: State): boolean => state.settings.hasPassword === true

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

export const lastUsedVersionSelector = (state: State): string => state.settings.lastUsedVersion

export const langAndRegionSelector = (
  state: State,
): { language: string, region: ?string, useSystem: boolean } => {
  let { language, region } = state.settings
  if (language && languages.includes(language)) {
    return { language, region, useSystem: false }
  }
  const locale = getSystemLocale()
  language = locale.language
  region = locale.region
  if (!language || !languages.includes(language)) {
    language = 'en'
    region = 'US'
  }
  return { language, region, useSystem: true }
}

export const languageSelector = createSelector(langAndRegionSelector, o => o.language)

export const localeSelector = createSelector(
  langAndRegionSelector,
  ({ language, region }) => (region ? `${language}-${region}` : language),
)

export const getOrderAccounts = (state: State) => state.settings.orderAccounts

export const areSettingsLoaded = (state: State) => state.settings.loaded

export const currencySettingsLocaleSelector = (
  settings: SettingsState,
  currency: CryptoCurrency,
): CurrencySettings => {
  const currencySettings = settings.currenciesSettings[currency.id]
  const val = { ...defaultsForCurrency(currency), ...currencySettings }
  return val
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
export const sentryLogsSelector = (state: State) => state.settings.sentryLogs
export const autoLockTimeoutSelector = (state: State) => state.settings.autoLockTimeout
export const shareAnalyticsSelector = (state: State) => state.settings.shareAnalytics
export const selectedTimeRangeSelector = (state: State) => state.settings.selectedTimeRange
export const hasCompletedOnboardingSelector = (state: State) =>
  state.settings.hasCompletedOnboarding

export const dismissedBannersSelector = (state: State) => state.settings.dismissedBanners || []

export const exportSettingsSelector = createSelector(
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  state => state.settings.currenciesSettings,
  developerModeSelector,
  (counterValueCurrency, counterValueExchange, currenciesSettings, developerModeEnabled) => ({
    counterValue: counterValueCurrency.ticker,
    counterValueExchange,
    currenciesSettings,
    developerModeEnabled,
  }),
)

export default handleActions(handlers, INITIAL_STATE)
