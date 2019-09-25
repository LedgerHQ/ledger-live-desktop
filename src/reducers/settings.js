// @flow

import { handleActions } from 'redux-actions'
import {
  findCurrencyByTicker,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from '@ledgerhq/live-common/lib/currencies'
import { getLanguages } from 'config/languages'
import { createSelector } from 'reselect'
import type { InputSelector as Selector } from 'reselect'
import type { CryptoCurrency, Currency } from '@ledgerhq/live-common/lib/types'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import { currencySettingsDefaults } from 'helpers/SettingsDefaults'
import { getSystemLocale } from 'helpers/systemLocale'

import type { CurrencySettings } from 'types/common'
import type { State } from 'reducers'

const bitcoin = getCryptoCurrencyById('bitcoin')
const ethereum = getCryptoCurrencyById('ethereum')
export const possibleIntermediaries = [bitcoin, ethereum]
export const intermediaryCurrency = (from: Currency, _to: Currency) => {
  if (from === ethereum || (from && from.type === 'TokenCurrency')) return ethereum
  return bitcoin
}

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
  starredAccountIds: string[],
  counterValue: string,
  language: ?string,
  theme: ?string,
  region: ?string,
  orderAccounts: string,
  countervalueFirst: boolean,
  hasPassword: boolean,
  autoLockTimeout: number,
  selectedTimeRange: TimeRange,
  marketIndicator: 'eastern' | 'western',
  currenciesSettings: {
    [currencyId: string]: CurrencySettings,
  },
  pairExchanges: {
    [pair: string]: ?string,
  },
  developerMode: boolean,
  shareAnalytics: boolean,
  sentryLogs: boolean,
  lastUsedVersion: string,
  dismissedBanners: string[],
  accountsViewMode: 'card' | 'list',
  showAccountsHelperBanner: boolean,
  hideEmptyTokenAccounts: boolean,
  sidebarCollapsed: boolean,
}

const defaultsForCurrency: Currency => CurrencySettings = crypto => {
  const defaults = currencySettingsDefaults(crypto)
  return {
    confirmationsNb: defaults.confirmationsNb ? defaults.confirmationsNb.def : 0,
  }
}

const INITIAL_STATE: SettingsState = {
  hasCompletedOnboarding: false,
  starredAccountIds: [],
  counterValue: 'USD',
  language: null,
  theme: null,
  region: null,
  orderAccounts: 'balance|desc',
  countervalueFirst: false,
  hasPassword: false,
  autoLockTimeout: 10,
  selectedTimeRange: 'month',
  marketIndicator: 'western',
  currenciesSettings: {},
  pairExchanges: {},
  developerMode: !!process.env.__DEV__,
  loaded: false,
  shareAnalytics: true,
  sentryLogs: true,
  lastUsedVersion: __APP_VERSION__,
  dismissedBanners: [],
  accountsViewMode: 'list',
  showAccountsHelperBanner: true,
  hideEmptyTokenAccounts: getEnv('HIDE_EMPTY_TOKEN_ACCOUNTS'),
  sidebarCollapsed: false,
}

const pairHash = (from, to) => `${from.ticker}_${to.ticker}`

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
    const copy = { ...state }
    copy.pairExchanges = { ...copy.pairExchanges }
    for (const { to, from, exchange } of pairs) {
      copy.pairExchanges[pairHash(from, to)] = exchange
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
  SETTINGS_TOGGLE_STAR: (state: SettingsState, { accountId }) => ({
    ...state,
    starredAccountIds: state.starredAccountIds.includes(accountId)
      ? state.starredAccountIds.filter(e => e !== accountId)
      : [...state.starredAccountIds, accountId],
  }),
  SETTINGS_DRAG_DROP_STAR: (state: SettingsState, { payload: { from, to } }) => {
    const ids = [...state.starredAccountIds]
    const fromIndex = ids.indexOf(from)
    const toIndex = ids.indexOf(to)

    ids.splice(toIndex, 0, ids.splice(fromIndex, 1)[0])

    return {
      ...state,
      starredAccountIds: ids,
    }
  },
  SETTINGS_REPLACE_STAR_ID: (state: SettingsState, { payload: { oldId, newId } }) => ({
    ...state,
    starredAccountIds: state.starredAccountIds.map(starredAccountId =>
      starredAccountId === oldId ? newId : starredAccountId,
    ),
  }),
  // used to debug performance of redux updates
  DEBUG_TICK: state => ({ ...state }),
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

export const countervalueFirstSelector = createSelector(
  storeSelector,
  s => s.countervalueFirst,
)

export const developerModeSelector = (state: State): boolean => state.settings.developerMode

export const lastUsedVersionSelector = (state: State): string => state.settings.lastUsedVersion

export const themeSelector = (state: State): ?string => state.settings.theme

export const langAndRegionSelector = (
  state: State,
): { language: string, region: ?string, useSystem: boolean } => {
  const languages = getLanguages()
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

export const languageSelector = createSelector(
  langAndRegionSelector,
  o => o.language,
)

export const localeSelector = createSelector(
  langAndRegionSelector,
  ({ language, region }) => (region ? `${language}-${region}` : language),
)

export const getOrderAccounts = (state: State) => state.settings.orderAccounts

export const areSettingsLoaded = (state: State) => state.settings.loaded

export const currencySettingsLocaleSelector = (
  settings: SettingsState,
  currency: Currency,
): CurrencySettings => {
  const currencySettings = settings.currenciesSettings[currency.ticker]
  const val = { ...defaultsForCurrency(currency), ...currencySettings }
  return val
}

type CSS = Selector<*, { currency: CryptoCurrency }, CurrencySettings>

export const currencyPropExtractor = (_: *, { currency }: *) => currency

// TODO drop (bad perf implication)
export const currencySettingsSelector: CSS = createSelector(
  storeSelector,
  currencyPropExtractor,
  currencySettingsLocaleSelector,
)

export const exchangeSettingsForPairSelector = (
  state: State,
  { from, to }: { from: Currency, to: Currency },
): ?string => state.settings.pairExchanges[pairHash(from, to)]

export const confirmationsNbForCurrencySelector = (
  state: State,
  { currency }: { currency: CryptoCurrency },
): number => {
  const obj = state.settings.currenciesSettings[currency.ticker]
  if (obj) return obj.confirmationsNb
  const defs = currencySettingsDefaults(currency)
  return defs.confirmationsNb ? defs.confirmationsNb.def : 0
}

export const sidebarCollapsedSelector = (state: State) => state.settings.sidebarCollapsed
export const accountsViewModeSelector = (state: State) => state.settings.accountsViewMode
export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator
export const sentryLogsSelector = (state: State) => state.settings.sentryLogs
export const autoLockTimeoutSelector = (state: State) => state.settings.autoLockTimeout
export const shareAnalyticsSelector = (state: State) => state.settings.shareAnalytics
export const selectedTimeRangeSelector = (state: State) => state.settings.selectedTimeRange
export const hasCompletedOnboardingSelector = (state: State) =>
  state.settings.hasCompletedOnboarding

export const dismissedBannersSelector = (state: State) => state.settings.dismissedBanners || []

export const dismissedBannerSelector = (state: State, { bannerKey }: { bannerKey: string }) =>
  (state.settings.dismissedBanners || []).includes(bannerKey)

export const hideEmptyTokenAccountsSelector = (state: State) =>
  state.settings.hideEmptyTokenAccounts

export const exportSettingsSelector = createSelector(
  counterValueCurrencySelector,
  state => state.settings.currenciesSettings,
  state => state.settings.pairExchanges,
  developerModeSelector,
  (counterValueCurrency, currenciesSettings, pairExchanges, developerModeEnabled) => ({
    counterValue: counterValueCurrency.ticker,
    currenciesSettings,
    pairExchanges,
    developerModeEnabled,
  }),
)

export const starredAccountIdsSelector = (state: State) => state.settings.starredAccountIds

export default handleActions(handlers, INITIAL_STATE)
