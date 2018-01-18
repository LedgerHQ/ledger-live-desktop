// @flow

import { handleActions, createAction } from 'redux-actions'

import { hasPassword } from 'reducers/settings'

export type ApplicationState = {}

const state: ApplicationState = {}

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
}

// Actions

export const unlock = createAction('APPLICATION_SET_DATA', () => ({ isLocked: false }))
export const lock = createAction('APPLICATION_SET_DATA', () => ({ isLocked: true }))

// Selectors

export const isLocked = (state: Object) =>
  state.application.isLocked === undefined ? hasPassword(state) : state.application.isLocked

// Exporting reducer

export default handleActions(handlers, state)
