// @flow

import type { Dispatch } from "redux";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";
import type { Currency } from "@ledgerhq/live-common/lib/types";

import { setEnvOnAllThreads } from "./../../helpers/env";
import type { SettingsState as Settings } from "./../reducers/settings";
import { refreshAccountsOrdering } from "~/renderer/actions/general";

export type SaveSettings = ($Shape<Settings>) => { type: string, payload: $Shape<Settings> };

export const saveSettings: SaveSettings = payload => ({
  type: "DB:SAVE_SETTINGS",
  payload,
});

export const setCountervalueFirst = (countervalueFirst: boolean) =>
  saveSettings({ countervalueFirst });
export const setAccountsViewMode = (accountsViewMode: *) => saveSettings({ accountsViewMode });
export const setSelectedTimeRange = (selectedTimeRange: PortfolioRange) =>
  saveSettings({ selectedTimeRange });
export const setDeveloperMode = (developerMode: boolean) => saveSettings({ developerMode });
export const setDiscreetMode = (discreetMode: boolean) => saveSettings({ discreetMode });
export const setSentryLogs = (sentryLogs: boolean) => saveSettings({ sentryLogs });
export const setShareAnalytics = (shareAnalytics: boolean) => saveSettings({ shareAnalytics });
export const setMarketIndicator = (marketIndicator: *) => saveSettings({ marketIndicator });
export const setAutoLockTimeout = (autoLockTimeout: *) => saveSettings({ autoLockTimeout });
export const setHasInstalledApps = (hasInstalledApps: boolean) =>
  saveSettings({ hasInstalledApps });
export const setHasOutdatedAppsOrFirmware = (hasOutdatedAppsOrFirmware: boolean) =>
  saveSettings({ hasOutdatedAppsOrFirmware });
export const setCounterValue = (counterValue: string) =>
  saveSettings({
    counterValue,
    pairExchanges: {},
  });
export const setLanguage = (language: ?string) => saveSettings({ language });
export const setTheme = (theme: ?string) => saveSettings({ theme });
export const setRegion = (region: ?string) => saveSettings({ region });
export const setHideEmptyTokenAccounts = (hideEmptyTokenAccounts: boolean) => async (
  dispatch: *,
) => {
  if (setEnvOnAllThreads("HIDE_EMPTY_TOKEN_ACCOUNTS", hideEmptyTokenAccounts)) {
    dispatch(saveSettings({ hideEmptyTokenAccounts }));
    dispatch(refreshAccountsOrdering());
  }
};
export const setSidebarCollapsed = (sidebarCollapsed: boolean) =>
  saveSettings({ sidebarCollapsed });

export const blacklistToken = (tokenId: string) => ({
  type: "BLACKLIST_TOKEN",
  payload: tokenId,
});

export const showToken = (tokenId: string) => ({
  type: "SHOW_TOKEN",
  payload: tokenId,
});

type FetchSettings = (*) => (Dispatch<*>) => void;
export const fetchSettings: FetchSettings = (settings: *) => dispatch => {
  dispatch({
    type: "FETCH_SETTINGS",
    payload: settings,
  });
};

type SetExchangePairs = (
  Array<{
    from: Currency,
    to: Currency,
    exchange: ?string,
  }>,
) => *;

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
