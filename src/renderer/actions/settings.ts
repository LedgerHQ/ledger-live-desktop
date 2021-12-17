import { useCallback } from "react";
import type { Action, Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import type { CryptoCurrency, Currency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { DeviceModelInfo } from "@ledgerhq/live-common/lib/types/manager";
import { setEnvOnAllThreads } from "~/helpers/env";
import { confirmationsNbForCurrencySelector, CurrenciesSettings, currencySettingsSelector, SettingsState as Settings } from "~/renderer/reducers/settings";
import {
  hideEmptyTokenAccountsSelector,
  selectedTimeRangeSelector,
} from "~/renderer/reducers/settings";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { LangKeys } from "~/config/languages";
import { State } from "../reducers";

export type SaveSettings = (payload: Partial<Settings>) => ({ type: string, payload: Partial<Settings> });

export const saveSettings: SaveSettings = payload => ({
  type: "DB:SAVE_SETTINGS",
  payload,
});

export const setCountervalueFirst = (countervalueFirst: boolean) =>
  saveSettings({ countervalueFirst });
export const setAccountsViewMode = (accountsViewMode: any) => saveSettings({ accountsViewMode });
export const setSelectedTimeRange = (selectedTimeRange: PortfolioRange) =>
  saveSettings({ selectedTimeRange });
export const setDeveloperMode = (developerMode: boolean) => saveSettings({ developerMode });
export const setDiscreetMode = (discreetMode: boolean) => saveSettings({ discreetMode });
export const setCarouselVisibility = (carouselVisibility: number) =>
  saveSettings({ carouselVisibility });
export const setSentryLogs = (sentryLogs: boolean) => saveSettings({ sentryLogs });
export const setFullNodeEnabled = (fullNodeEnabled: boolean) => saveSettings({ fullNodeEnabled });
export const setShareAnalytics = (shareAnalytics: boolean) => saveSettings({ shareAnalytics });
export const setMarketIndicator = (marketIndicator: any) => saveSettings({ marketIndicator });
export const setAutoLockTimeout = (autoLockTimeout: any) => saveSettings({ autoLockTimeout });
export const setHasInstalledApps = (hasInstalledApps: boolean) =>
  saveSettings({ hasInstalledApps });

// developer
export const setAllowDebugApps = (allowDebugApps: boolean) => saveSettings({ allowDebugApps });
export const setAllowExperimentalApps = (allowExperimentalApps: boolean) =>
  saveSettings({ allowExperimentalApps });
export const setEnablePlatformDevTools = (enablePlatformDevTools: boolean) =>
  saveSettings({ enablePlatformDevTools });
export const setCatalogProvider = (catalogProvider: string) => saveSettings({ catalogProvider });
export const setCurrencyConfirmationNb = (currenciesSettings: CurrenciesSettings, currency: CryptoCurrency | TokenCurrency, confirmationsNb: number) => {
  const currencySettings = currenciesSettings[currency.ticker];
  let newCurrenciesSettings = {};
  if (!currencySettings) {
    newCurrenciesSettings = {
      ...currenciesSettings,
      [currency.ticker]: {
        confirmationsNb
      },
    };
  } else {
    newCurrenciesSettings = {
      ...currenciesSettings,
      [currency.ticker]: {
        ...currencySettings,
        confirmationsNb
      },
    };
  }
  return saveSettings({ currenciesSettings: newCurrenciesSettings });
};

export const setCounterValue = (counterValue: string) =>
  saveSettings({
    counterValue,
    pairExchanges: {},
  });
export const setLanguage = (language?: LangKeys) => saveSettings({ language });
export const setTheme = (theme?: string) => saveSettings({ theme });
export const setRegion = (region?: string) => saveSettings({ region });
export const setUSBTroubleshootingIndex = (USBTroubleshootingIndex?: number) =>
  saveSettings({ USBTroubleshootingIndex });

export function useHideEmptyTokenAccounts(): [boolean, (value: boolean) => void] {
  const dispatch = useDispatch();
  const value = useSelector(hideEmptyTokenAccountsSelector);
  const refreshAccountsOrdering = useRefreshAccountsOrdering();

  const setter = useCallback(
    (hideEmptyTokenAccounts: boolean) => {
      if (setEnvOnAllThreads("HIDE_EMPTY_TOKEN_ACCOUNTS", hideEmptyTokenAccounts)) {
        dispatch(saveSettings({ hideEmptyTokenAccounts }));
        refreshAccountsOrdering();
      }
    },
    [dispatch, refreshAccountsOrdering],
  );
  return [value, setter];
}

type PortfolioRangeOption = {
  key: PortfolioRange,
  value: string,
  label: string,
};

export function useCurrencyConfirmationsNb(currency: CryptoCurrency | TokenCurrency): [number, (value: number) => void] {
  const dispatch = useDispatch();
  const currencySettings = useSelector((state: State) => state.settings.currenciesSettings);
  const { confirmationsNb } = currencySettings[currency.ticker] || {};

  const updateCurrencySettings = (nb: number) => dispatch(setCurrencyConfirmationNb(currencySettings, currency, nb));
  return [confirmationsNb, updateCurrencySettings];
};

export function useTimeRange() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const val = useSelector(selectedTimeRangeSelector);
  const setter = useCallback(
    (_range: PortfolioRange | PortfolioRangeOption) => {
      const range = typeof _range === "string" ? _range : _range.key;
      dispatch(setSelectedTimeRange(range));
    },
    [dispatch],
  );
  const ranges: PortfolioRange[] = ["day", "week", "month", "year", "all"];
  const options: PortfolioRangeOption[] = ranges.map(key => ({
    key,
    value: t(`time.range.${key}`),
    label: t(`time.range.${key}`),
  }));
  return [val, setter, options];
}

export const setShowClearCacheBanner = (showClearCacheBanner: boolean) =>
  saveSettings({ showClearCacheBanner });
export const setSidebarCollapsed = (sidebarCollapsed: boolean) =>
  saveSettings({ sidebarCollapsed });

export const blacklistToken = (tokenId: string) => ({
  type: "BLACKLIST_TOKEN",
  payload: tokenId,
});

export const swapAcceptProvider = (providerId: string) => ({
  type: "ACCEPT_SWAP_PROVIDER",
  payload: providerId,
});

export const showToken = (tokenId: string) => ({
  type: "SHOW_TOKEN",
  payload: tokenId,
});

type FetchSettings = (param: any) => (dispatch: Dispatch<Action<any>>) => void;
export const fetchSettings: FetchSettings = settings => dispatch => {
  dispatch({
    type: "FETCH_SETTINGS",
    payload: settings,
  });
};

type SetExchangePairs = (
  pairs: Array<{
    from: Currency,
    to: Currency,
    exchange?: string,
  }>
) => any;

export const setExchangePairsAction: SetExchangePairs = pairs => ({
  type: "SETTINGS_SET_PAIRS",
  pairs,
});

export const dismissBanner = (bannerKey: string) => ({
  type: "SETTINGS_DISMISS_BANNER",
  payload: bannerKey,
});

export const setPreferredDeviceModel = (preferredDeviceModel: DeviceModelId) =>
  saveSettings({ preferredDeviceModel });

export const setLastSeenDeviceInfo = ({
  lastSeenDevice,
  latestFirmware,
}: {
  lastSeenDevice: DeviceModelInfo,
  latestFirmware: any,
}) => ({
  type: "LAST_SEEN_DEVICE_INFO",
  payload: { lastSeenDevice, latestFirmware },
});

export const setDeepLinkUrl = (url?: string) => ({
  type: "SET_DEEPLINK_URL",
  payload: url,
});

export const setFirstTimeLend = () => ({
  type: "SET_FIRST_TIME_LEND",
});

export const setSwapSelectableCurrencies = (selectableCurrencies: string[]) => ({
  type: "SET_SWAP_SELECTABLE_CURRENCIES",
  payload: selectableCurrencies,
});

export const setSwapHasAcceptedIPSharing = (hasAcceptedIPSharing: boolean) => ({
  type: "SET_SWAP_ACCEPTED_IP_SHARING",
  payload: hasAcceptedIPSharing,
});

export const setSwapKYCStatus = (payload: { provider: string, id?: string, status?: string }) => ({
  type: "SET_SWAP_KYC",
  payload,
});
