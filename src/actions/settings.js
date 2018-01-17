// @flow

import db from 'helpers/db'

import type { Settings } from 'types/common'

export type SaveSettings = Settings => { type: string, payload: Settings }
export const saveSettings: SaveSettings = payload => ({
  type: 'DB:SAVE_SETTINGS',
  payload,
})

type FetchSettings = () => { type: string }
export const fetchSettings: FetchSettings = () => ({
  type: 'FETCH_SETTINGS',
  payload: db.settings(),
})
