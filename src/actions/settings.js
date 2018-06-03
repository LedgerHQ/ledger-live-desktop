// @flow

import type { Dispatch } from 'redux'
import type { SettingsState as Settings } from 'reducers/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'

export type SaveSettings = Settings => { type: string, payload: $Shape<Settings> }
export const saveSettings: SaveSettings = payload => ({
  type: 'DB:SAVE_SETTINGS',
  payload,
})

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
