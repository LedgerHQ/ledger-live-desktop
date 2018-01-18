// @flow

import { handleActions } from 'redux-actions'

import get from 'lodash/get'

import type { Settings } from 'types/common'

export type SettingsState = Object

const state: SettingsState = {}

const handlers: Object = {
  SAVE_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => settings,
  FETCH_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => settings,
}

export const hasPassword = (state: Object) => get(state.settings, 'password.state', false)

export default handleActions(handlers, state)
