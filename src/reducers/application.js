// @flow

import { handleActions, createAction } from 'redux-actions'

export type ApplicationState = {
  isLocked?: boolean,
}

const state: ApplicationState = {}

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
}

// Actions // FIXME why isn't this in actions/*

export const unlock = createAction('APPLICATION_SET_DATA', () => ({ isLocked: false }))
export const lock = createAction('APPLICATION_SET_DATA', () => ({ isLocked: true }))

// Selectors

export const isLocked = (state: Object) => state.application.isLocked === true

// Exporting reducer

export default handleActions(handlers, state)
