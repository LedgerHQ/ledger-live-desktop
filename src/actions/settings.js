// @flow

import type { Dispatch } from 'redux'
import type { SettingsState as Settings } from 'reducers/settings'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setEnvOnAllThreads } from 'helpers/env'

export type SaveSettings = ($Shape<Settings>) => { type: string, payload: $Shape<Settings> }

export const saveSettings: SaveSettings = payload => ({
  type: 'DB:SAVE_SETTINGS',
  payload,
})

export const setCountervalueFirst = (countervalueFirst: boolean) =>
  saveSettings({ countervalueFirst })
export const setAccountsViewMode = (accountsViewMode: *) => saveSettings({ accountsViewMode })
export const setSelectedTimeRange = (selectedTimeRange: PortfolioRange) =>
  saveSettings({ selectedTimeRange })
export const setDeveloperMode = (developerMode: boolean) => saveSettings({ developerMode })
export const setSentryLogs = (sentryLogs: boolean) => saveSettings({ sentryLogs })
export const setShareAnalytics = (shareAnalytics: boolean) => saveSettings({ shareAnalytics })
export const setMarketIndicator = (marketIndicator: *) => saveSettings({ marketIndicator })
export const setAutoLockTimeout = (autoLockTimeout: *) => saveSettings({ autoLockTimeout })
export const setCounterValue = (counterValue: string) =>
  saveSettings({
    counterValue,
    pairExchanges: {},
  })
export const setLanguage = (language: ?string) => saveSettings({ language })
export const setTheme = (theme: ?string) => saveSettings({ theme })
export const setRegion = (region: ?string) => saveSettings({ region })
export const setHideEmptyTokenAccounts = (hideEmptyTokenAccounts: boolean) => async (
  dispatch: *,
) => {
  if (setEnvOnAllThreads('HIDE_EMPTY_TOKEN_ACCOUNTS', hideEmptyTokenAccounts)) {
    dispatch(saveSettings({ hideEmptyTokenAccounts }))
  }
}
export const setSidebarCollapsed = (sidebarCollapsed: boolean) => saveSettings({ sidebarCollapsed })

type FetchSettings = (*) => (Dispatch<*>) => void
export const fetchSettings: FetchSettings = (settings: *) => dispatch => {
  dispatch({
    type: 'FETCH_SETTINGS',
    payload: settings,
  })
}

type SetExchangePairs = (
  Array<{
    from: Currency,
    to: Currency,
    exchange: ?string,
  }>,
) => *

export const setExchangePairsAction: SetExchangePairs = pairs => ({
  type: 'SETTINGS_SET_PAIRS',
  pairs,
})

export const dismissBanner = (bannerKey: string) => ({
  type: 'SETTINGS_DISMISS_BANNER',
  payload: bannerKey,
})

export const toggleStarAction = (accountId: string) => ({
  type: 'SETTINGS_TOGGLE_STAR',
  accountId,
})

export const dragDropStarAction = (payload: { from: string, to: string }) => ({
  type: 'SETTINGS_DRAG_DROP_STAR',
  payload,
})

export const replaceStarAccountId = (payload: { oldId: string, newId: string }) => ({
  type: 'SETTINGS_REPLACE_STAR_ID',
  payload,
})
