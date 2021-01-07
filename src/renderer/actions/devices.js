// @flow

import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";

export type SetCurrentDevice = (Device | null) => { type: string, payload: Device | null };
export const setCurrentDevice: SetCurrentDevice = payload => ({
  type: "SET_CURRENT_DEVICE",
  payload,
});

type AddDevice = Device => { type: string, payload: Device };
export const addDevice: AddDevice = payload => ({
  type: "ADD_DEVICE",
  payload,
});

type RemoveDevice = Device => { type: string, payload: Device };
export const removeDevice: RemoveDevice = payload => ({
  type: "REMOVE_DEVICE",
  payload,
});

export const resetDevices = () => ({
  type: "RESET_DEVICES",
});
