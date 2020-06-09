// @flow

import { handleActions } from "redux-actions";
import { createSelector } from "reselect";
import type { OutputSelector, InputSelector as Selector } from "reselect";
import {
  findCurrencyByTicker,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from "@ledgerhq/live-common/lib/currencies";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { CryptoCurrency, Currency } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getLanguages } from "~/config/languages";
import type { State } from ".";
import { osLangAndRegionSelector } from "~/renderer/reducers/application";
import { listSupportedFiats } from "@ledgerhq/live-common/lib/data/fiat";

export type CurrencySettings = {
  confirmationsNb: number,
};

export type CurrenciesSettings = {
  [id: string]: CurrencySettings,
};

type ConfirmationDefaults = {
  confirmationsNb: ?{
    min: number,
    def: number,
    max: number,
  },
};

export const currencySettingsDefaults = (c: Currency): ConfirmationDefaults => {
  let confirmationsNb;
  if (c.type === "CryptoCurrency") {
    const { blockAvgTime } = c;
    if (blockAvgTime) {
      const def = Math.ceil((30 * 60) / blockAvgTime); // 30 min approx validation
      confirmationsNb = { min: 1, def, max: 3 * def };
    }
  }
  return {
    confirmationsNb,
  };
};

const bitcoin = getCryptoCurrencyById("bitcoin");
const ethereum = getCryptoCurrencyById("ethereum");
export const possibleIntermediaries = [bitcoin, ethereum];
export const intermediaryCurrency = (from: Currency, _to: Currency) => {
  if (from === ethereum || (from && from.type === "TokenCurrency")) return ethereum;
  return bitcoin;
};

export const timeRangeDaysByKey = {
  week: 7,
  month: 30,
  year: 365,
};

export type TimeRange = $Keys<typeof timeRangeDaysByKey>;

export type LangAndRegion = { language: string, region: ?string, useSystem: boolean };

export type SettingsState = {
  loaded: boolean, // is the settings loaded from db (it not we don't save them)
  hasCompletedOnboarding: boolean,
  counterValue: string,
  preferredDeviceModel: DeviceModelId,
  hasInstalledApps: boolean,
  hasOutdatedAppsOrFirmware: boolean,
  language: ?string,
  theme: ?string,
  region: ?string,
  orderAccounts: string,
  countervalueFirst: boolean,
  autoLockTimeout: number,
  selectedTimeRange: TimeRange,
  marketIndicator: "eastern" | "western",
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
  accountsViewMode: "card" | "list",
  showAccountsHelperBanner: boolean,
  hideEmptyTokenAccounts: boolean,
  sidebarCollapsed: boolean,
  discreetMode: boolean,
  starredAccountIds?: string[],
  blacklistedTokenIds: string[],
};

const defaultsForCurrency: Currency => CurrencySettings = crypto => {
  const defaults = currencySettingsDefaults(crypto);
  return {
    confirmationsNb: defaults.confirmationsNb ? defaults.confirmationsNb.def : 0,
  };
};

const INITIAL_STATE: SettingsState = {
  hasCompletedOnboarding: false,
  counterValue: "USD",
  preferredDeviceModel: "nanoS",
  language: null,
  theme: null,
  region: null,
  orderAccounts: "balance|desc",
  countervalueFirst: false,
  autoLockTimeout: 10,
  selectedTimeRange: "month",
  marketIndicator: "western",
  currenciesSettings: {},
  pairExchanges: {},
  developerMode: !!process.env.__DEV__,
  loaded: false,
  shareAnalytics: true,
  sentryLogs: true,
  lastUsedVersion: __APP_VERSION__,
  dismissedBanners: [],
  accountsViewMode: "list",
  showAccountsHelperBanner: true,
  hideEmptyTokenAccounts: getEnv("HIDE_EMPTY_TOKEN_ACCOUNTS"),
  sidebarCollapsed: false,
  discreetMode: false,
  hasInstalledApps: true,
  hasOutdatedAppsOrFirmware: true, // turn back to false post-July-2020
  blacklistedTokenIds: [],
};

const pairHash = (from, to) => `${from.ticker}_${to.ticker}`;

export const supportedCountervalues = [...listSupportedFiats(), ...possibleIntermediaries].map<any>(
  currency => ({
    value: currency.ticker,
    label: `${currency.name} - ${currency.ticker}`,
    currency,
  }),
);

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
    const copy = { ...state };
    copy.pairExchanges = { ...copy.pairExchanges };
    for (const { to, from, exchange } of pairs) {
      copy.pairExchanges[pairHash(from, to)] = exchange;
    }
    return copy;
  },
  SAVE_SETTINGS: (state: SettingsState, { payload }: { payload: $Shape<SettingsState> }) => {
    if (!payload) return state;
    const changed = Object.keys(payload).some(key => payload[key] !== state[key]);
    if (!changed) return state;
    return {
      ...state,
      ...payload,
    };
  },
  FETCH_SETTINGS: (
    state: SettingsState,
    { payload: settings }: { payload: $Shape<SettingsState> },
  ) => {
    if (
      settings.counterValue &&
      !supportedCountervalues.find(({ currency }) => currency.ticker === settings.counterValue)
    ) {
      settings.counterValue = INITIAL_STATE.counterValue;
    }
    return {
      ...state,
      ...settings,
      loaded: true,
    };
  },
  SETTINGS_DISMISS_BANNER: (state: SettingsState, { payload: bannerId }) => ({
    ...state,
    dismissedBanners: [...state.dismissedBanners, bannerId],
  }),
  SHOW_TOKEN: (state: SettingsState, { payload: tokenId }) => {
    const ids = state.blacklistedTokenIds;
    return {
      ...state,
      blacklistedTokenIds: ids.filter(id => id !== tokenId),
    };
  },
  BLACKLIST_TOKEN: (state: SettingsState, { payload: tokenId }) => {
    const ids = state.blacklistedTokenIds;
    return {
      ...state,
      blacklistedTokenIds: [...ids, tokenId],
    };
  },
  // used to debug performance of redux updates
  DEBUG_TICK: state => ({ ...state }),
};

// TODO refactor selectors to *Selector naming convention

export const storeSelector = (state: State): SettingsState => state.settings;

export const settingsExportSelector = storeSelector;

export const discreetModeSelector = (state: State): boolean => state.settings.discreetMode === true;

export const getCounterValueCode = (state: State) => state.settings.counterValue;

export const counterValueCurrencyLocalSelector = (state: SettingsState): Currency =>
  findCurrencyByTicker(state.counterValue) || getFiatCurrencyByTicker("USD");

export const counterValueCurrencySelector: OutputSelector<State, void, Currency> = createSelector(
  storeSelector,
  counterValueCurrencyLocalSelector,
);

export const countervalueFirstSelector: OutputSelector<State, void, boolean> = createSelector(
  storeSelector,
  s => s.countervalueFirst,
);

export const developerModeSelector = (state: State): boolean => state.settings.developerMode;

export const lastUsedVersionSelector = (state: State): string => state.settings.lastUsedVersion;

export const userThemeSelector = (state: State): ?string => state.settings.theme;

export const userLangAndRegionSelector = (
  state: State,
): ?{ language: string, region: ?string, useSystem: boolean } => {
  const languages = getLanguages();
  const { language, region } = state.settings;
  if (language && languages.includes(language)) {
    return { language, region, useSystem: false };
  }
};

export const langAndRegionSelector: OutputSelector<State, void, LangAndRegion> = createSelector(
  userLangAndRegionSelector,
  osLangAndRegionSelector,
  (userLang, osLang) => {
    return userLang || osLang;
  },
);

export const languageSelector: OutputSelector<State, void, string> = createSelector(
  langAndRegionSelector,
  o => o.language,
);

export const localeSelector: OutputSelector<
  State,
  void,
  string,
> = createSelector(langAndRegionSelector, ({ language, region }) =>
  region ? `${language}-${region}` : language,
);

export const getOrderAccounts = (state: State) => state.settings.orderAccounts;

export const areSettingsLoaded = (state: State) => state.settings.loaded;

export const currencySettingsLocaleSelector = (
  settings: SettingsState,
  currency: Currency,
): CurrencySettings => {
  const currencySettings = settings.currenciesSettings[currency.ticker];
  const val = { ...defaultsForCurrency(currency), ...currencySettings };
  return val;
};

type CSS = Selector<*, { currency: CryptoCurrency }, CurrencySettings>;

export const currencyPropExtractor = (_: *, { currency }: *) => currency;

// TODO: drop (bad perf implication)
export const currencySettingsSelector: CSS = createSelector(
  storeSelector,
  currencyPropExtractor,
  currencySettingsLocaleSelector,
);

export const exchangeSettingsForPairSelector = (
  state: State,
  { from, to }: { from: Currency, to: Currency },
): ?string => state.settings.pairExchanges[pairHash(from, to)];

export const confirmationsNbForCurrencySelector = (
  state: State,
  { currency }: { currency: CryptoCurrency },
): number => {
  const obj = state.settings.currenciesSettings[currency.ticker];
  if (obj) return obj.confirmationsNb;
  const defs = currencySettingsDefaults(currency);
  return defs.confirmationsNb ? defs.confirmationsNb.def : 0;
};

export const preferredDeviceModelSelector = (state: State) => state.settings.preferredDeviceModel;
export const sidebarCollapsedSelector = (state: State) => state.settings.sidebarCollapsed;
export const accountsViewModeSelector = (state: State) => state.settings.accountsViewMode;
export const marketIndicatorSelector = (state: State) => state.settings.marketIndicator;
export const sentryLogsSelector = (state: State) => state.settings.sentryLogs;
export const autoLockTimeoutSelector = (state: State) => state.settings.autoLockTimeout;
export const shareAnalyticsSelector = (state: State) => state.settings.shareAnalytics;
export const selectedTimeRangeSelector = (state: State) => state.settings.selectedTimeRange;
export const hasInstalledAppsSelector = (state: State) => state.settings.hasInstalledApps;
export const hasOutdatedAppsOrFirmwareSelector = (state: State) =>
  state.settings.hasOutdatedAppsOrFirmware;
export const blacklistedTokenIdsSelector = (state: State) => state.settings.blacklistedTokenIds;
export const hasCompletedOnboardingSelector = (state: State) =>
  state.settings.hasCompletedOnboarding;

export const dismissedBannersSelector = (state: State) => state.settings.dismissedBanners || [];

export const dismissedBannerSelector = (state: State, { bannerKey }: { bannerKey: string }) =>
  (state.settings.dismissedBanners || []).includes(bannerKey);

export const dismissedBannerSelectorLoaded = (bannerKey: string) => (state: State) =>
  (state.settings.dismissedBanners || []).includes(bannerKey);

export const hideEmptyTokenAccountsSelector = (state: State) =>
  state.settings.hideEmptyTokenAccounts;

export const exportSettingsSelector: OutputSelector<State, void, *> = createSelector(
  counterValueCurrencySelector,
  state => state.settings.currenciesSettings,
  state => state.settings.pairExchanges,
  developerModeSelector,
  blacklistedTokenIdsSelector,
  (
    counterValueCurrency,
    currenciesSettings,
    pairExchanges,
    developerModeEnabled,
    blacklistedTokenIds,
  ) => ({
    counterValue: counterValueCurrency.ticker,
    currenciesSettings,
    pairExchanges,
    developerModeEnabled,
    blacklistedTokenIds,
  }),
);

export default handleActions(handlers, INITIAL_STATE);
