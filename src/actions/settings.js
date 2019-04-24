// @flow

import type { Dispatch } from 'redux'
import type { SettingsState as Settings } from 'reducers/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'

export type SaveSettings = ($Shape<Settings>) => { type: string, payload: $Shape<Settings> }

export const saveSettings: SaveSettings = payload => ({
  type: 'DB:SAVE_SETTINGS',
  payload,
})

export const setCountervalueFirst = (countervalueFirst: boolean) =>
  saveSettings({ countervalueFirst })
export const setDeveloperMode = (developerMode: boolean) => saveSettings({ developerMode })
export const setSentryLogs = (sentryLogs: boolean) => saveSettings({ sentryLogs })
export const setShareAnalytics = (shareAnalytics: boolean) => saveSettings({ shareAnalytics })
export const setMarketIndicator = (marketIndicator: *) => saveSettings({ marketIndicator })
export const setAutoLockTimeout = (autoLockTimeout: *) => saveSettings({ autoLockTimeout })
export const setCounterValue = (counterValue: string) =>
  saveSettings({
    counterValue,
    counterValueExchange: null,
  })
export const setLanguage = (language: ?string) => saveSettings({ language })
export const setRegion = (region: ?string) => saveSettings({ region })
export const setCounterValueExchange = (counterValueExchange: ?string) =>
  saveSettings({ counterValueExchange })

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

export const dismissBanner = (bannerId: string) => ({
  type: 'SETTINGS_DISMISS_BANNER',
  payload: bannerId,
})
