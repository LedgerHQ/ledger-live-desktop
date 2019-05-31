// @flow

import { handleActions } from 'redux-actions'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import type { Device } from 'types/common'

export type DevicesState = {
  currentDevice: ?Device,
}

const initialState: DevicesState = {
  currentDevice: null,
}

const handlers: Object = {
  RESET_DEVICES: () => initialState,
  ADD_DEVICE: (state: DevicesState, { payload: currentDevice }: { payload: Device }) => ({
    currentDevice,
  }),
  REMOVE_DEVICE: (state: DevicesState, { payload: device }: { payload: Device }) => ({
    currentDevice:
      state.currentDevice && state.currentDevice.path === device.path ? null : state.currentDevice,
  }),
}

export function getCurrentDevice(state: { devices: DevicesState }) {
  if (getEnv('DEVICE_PROXY_URL')) {
    // bypass the listen devices (we should remove modelId here by instead get it at open time if needed)
    return { path: '', modelId: 'nanoS' }
  }
  return state.devices.currentDevice
}

export default handleActions(handlers, initialState)
