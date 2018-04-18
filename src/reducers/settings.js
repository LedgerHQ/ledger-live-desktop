// @flow

import { handleActions } from 'redux-actions'
import { getFiatUnit } from '@ledgerhq/currencies'

import get from 'lodash/get'

import type { Settings } from 'types/common'

export type SettingsState = Object

const defaultState: SettingsState = {
  username: 'Anonymous',
  counterValue: 'USD',
  language: 'en',
  orderAccounts: 'balance|asc',
  password: {
    isEnabled: false,
    value: '',
  },
}

const state: SettingsState = {
  ...defaultState,
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

export const hasPassword = (state: Object) =>
  get(state.settings, 'password.isEnabled', defaultState.password.isEnabled)

export const getCounterValueCode = (state: Object) =>
  get(state.settings, 'counterValue', defaultState.counterValue)

export const getCounterValueFiatUnit = (state: Object) => getFiatUnit(getCounterValueCode(state))

export const getLanguage = (state: Object) => get(state.settings, 'language', defaultState.language)

export const getOrderAccounts = (state: Object) =>
  get(state.settings, 'orderAccounts', defaultState.orderAccounts)

export default handleActions(handlers, state)
