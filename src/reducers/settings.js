// @flow

import { handleActions } from 'redux-actions'

import get from 'lodash/get'

import type { Settings } from 'types/common'

export type SettingsState = Object

const state: SettingsState = {
  language: 'en',
  orderAccounts: 'balance|desc',
  password: {
    state: false,
  },
}

const handlers: Object = {
  SAVE_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
  }),
  FETCH_SETTINGS: (state: SettingsState, { payload: settings }: { payload: Settings }) => ({
    ...state,
    ...settings,
  }),
}

export const hasPassword = (state: Object) => get(state.settings, 'password.state', false)
export const getLanguage = (state: Object) => get(state.settings, 'language', 'en')
export const getOrderAccounts = (state: Object) => get(state.settings, 'orderAccounts', 'balance')

export default handleActions(handlers, state)
