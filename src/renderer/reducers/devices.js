// @flow

import { handleActions } from "redux-actions";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { DeviceModelId } from "@ledgerhq/devices";

export type Device = {
  path: string,
  modelId: DeviceModelId,
};

export type DevicesState = {
  currentDevice: ?Device,
  devices: Device[],
};

const initialState: DevicesState = {
  currentDevice: null,
  devices: [],
};

function setCurrentDevice(state) {
  const currentDevice = state.devices.length ? state.devices[state.devices.length - 1] : null;
  return { ...state, currentDevice };
}

const handlers: Object = {
  RESET_DEVICES: () => initialState,
  ADD_DEVICE: (state: DevicesState, { payload: device }: { payload: Device }) =>
    setCurrentDevice({
      ...state,
      devices: [...state.devices, device].filter(
        (v, i, s) => s.findIndex(t => t.path === v.path) === i,
      ),
    }),
  REMOVE_DEVICE: (state: DevicesState, { payload: device }: { payload: Device }) => ({
    ...state,
    currentDevice:
      state.currentDevice && state.currentDevice.path === device.path ? null : state.currentDevice,
    devices: state.devices.filter(d => d.path !== device.path),
  }),
  SET_CURRENT_DEVICE: (state: DevicesState, { payload: currentDevice }: { payload: Device }) => ({
    ...state,
    currentDevice,
  }),
};

export function getCurrentDevice(state: { devices: DevicesState }) {
  if (getEnv("DEVICE_PROXY_URL") || getEnv("MOCK")) {
    // bypass the listen devices (we should remove modelId here by instead get it at open time if needed)
    return { path: "", modelId: "nanoS" };
  }
  return state.devices.currentDevice;
}

export function getDevices(state: { devices: DevicesState }) {
  if (getEnv("DEVICE_PROXY_URL")) {
    // bypass the listen devices
    return [{ path: "", modelId: "nanoS" }];
  }
  return state.devices.devices;
}

export default handleActions(handlers, initialState);
