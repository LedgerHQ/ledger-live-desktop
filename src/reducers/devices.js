// @flow

import { handleActions } from 'redux-actions'

import type { Device, Devices } from 'types/common'

type stateType = {
  currentDevice: Device | null,
  devices: Devices,
}
const state = {
  currentDevice: null,
  devices: [],
}

function setCurrentDevice(state) {
  return {
    ...state,
    currentDevice: state.devices.length === 1 ? state.devices[0] : state.currentDevice,
  }
}

const handlers: Object = {
  DEVICES_UPDATE: (state: stateType, { payload: devices }: { payload: Devices }) =>
    setCurrentDevice({
      ...state,
      devices,
    }),
  DEVICE_ADD: (state: stateType, { payload: device }: { payload: Device }) =>
    setCurrentDevice({
      ...state,
      devices: [...state.devices, device].filter(
        (v, i, s) => s.findIndex(t => t.path === v.path) === i,
      ),
    }),
  DEVICE_REMOVE: (state: stateType, { payload: device }: { payload: Device }) => ({
    ...state,
    currentDevice:
      state.currentDevice !== null && state.currentDevice.path === device.path
        ? null
        : state.currentDevice,
    devices: state.devices.filter(d => d.path !== device.path),
  }),
  DEVICE_CHOOSE: (state: stateType, { payload: currentDevice }: { payload: Device }) => ({
    ...state,
    currentDevice,
  }),
}

export function getCurrentDevice(state: Object) {
  return state.devices.currentDevice
}

export function getDevices(state: Object) {
  return state.devices.devices
}

export default handleActions(handlers, state)
