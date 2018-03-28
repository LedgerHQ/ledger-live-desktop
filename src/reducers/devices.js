// @flow

import { handleActions } from 'redux-actions'

import type { Device, Devices } from 'types/common'

export type DevicesState = {
  currentDevice: Device | null,
  devices: Devices,
}

const state: DevicesState = {
  currentDevice: null,
  devices: [],
}

function setCurrentDevice(state) {
  const currentDevice = state.devices.length ? state.devices[state.devices.length - 1] : null
  return { ...state, currentDevice }
}

function comparePath(pathA, pathB) {
  // Fix the issue when we remove device under OSX, we want to compare only
  // path without ending (the ,0 and ,1 probably the interface hid or u2f)
  if (process.platform === 'darwin') {
    const [pathAClean] = pathA.split('USB2')
    const [pathBClean] = pathB.split('USB2')

    console.log('comparePath')
    console.log(pathAClean, pathBClean, pathAClean === pathBClean)
    console.log('comparePath')

    return pathAClean === pathBClean
  }

  return pathA === pathB
}

const handlers: Object = {
  UPDATE_DEVICES: (state: DevicesState, { payload: devices }: { payload: Devices }) =>
    setCurrentDevice({
      ...state,
      devices,
    }),
  ADD_DEVICE: (state: DevicesState, { payload: device }: { payload: Device }) =>
    setCurrentDevice({
      ...state,
      devices: [...state.devices, device].filter(
        (v, i, s) => s.findIndex(t => comparePath(t.path, v.path)) === i,
      ),
    }),
  REMOVE_DEVICE: (state: DevicesState, { payload: device }: { payload: Device }) => ({
    ...state,
    currentDevice:
      state.currentDevice !== null && comparePath(state.currentDevice.path, device.path)
        ? null
        : state.currentDevice,
    devices: state.devices.filter(d => !comparePath(d.path, device.path)),
  }),
  SET_CURRENT_DEVICE: (state: DevicesState, { payload: currentDevice }: { payload: Device }) => ({
    ...state,
    currentDevice,
  }),
}

export function getCurrentDevice(state: { devices: DevicesState }) {
  return state.devices.currentDevice
}

export function getDevices(state: { devices: DevicesState }) {
  return state.devices.devices
}

export default handleActions(handlers, state)
