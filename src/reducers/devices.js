// @flow

import { handleActions } from 'redux-actions'

const state = []

const handlers = {
  DEVICES_UPDATE: (state, { payload: devices }) => devices,
  DEVICE_ADD: (state, { payload: device }) =>
    [...state, device].filter((v, i, s) => s.findIndex(t => t.path === v.path) === i),
  DEVICE_REMOVE: (state, { payload: device }) => state.filter(d => d.path !== device.path),
}

export default handleActions(handlers, state)
