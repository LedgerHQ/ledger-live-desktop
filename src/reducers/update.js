// @flow

import { handleActions, createAction } from 'redux-actions'

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'progress'
  | 'unavailable'
  | 'error'
  | 'downloaded'

export type UpdateState = {
  status: UpdateStatus,
  data?: Object,
}

const state: UpdateState = {
  status: 'idle',
  data: {},
}

const handlers = {
  UPDATE_SET_STATUS: (state: UpdateState, { payload }: { payload: UpdateState }): UpdateState =>
    payload,
}

// Actions

export const setUpdateStatus = createAction(
  'UPDATE_SET_STATUS',
  (status: UpdateStatus, data?: Object): UpdateState => ({ status, data }),
)

// Selectors

export function getUpdateStatus(state: { update: UpdateState }): UpdateStatus {
  return state.update.status
}

// Default export

export default handleActions(handlers, state)
