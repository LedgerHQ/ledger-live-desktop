// @flow

import db from 'helpers/db'

import type { Settings } from 'types/common'

export type SaveSettings = Settings => { type: string, payload: Settings }
export const saveSettings: SaveSettings = payload => ({
  type: 'DB:SAVE_SETTINGS',
  payload,
})

export const fetchSettings: Function = () => dispatch => {
  const settings = db.get('settings')
  if (Object.keys(settings).length === 0) {
    return
  }
  dispatch({
    type: 'FETCH_SETTINGS',
    payload: settings,
  })
}
