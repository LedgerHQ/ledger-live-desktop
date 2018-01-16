// @flow

/* eslint-disable import/prefer-default-export */

import type { Device, Devices } from 'types/common'

export type SetCurrentDevice = (Device | null) => { type: string, payload: Device | null }
export const setCurrentDevice: SetCurrentDevice = payload => ({
  type: 'SET_CURRENT_DEVICE',
  payload,
})

type AddDevice = Device => { type: string, payload: Device }
export const addDevice: AddDevice = payload => ({
  type: 'ADD_DEVICE',
  payload,
})

type RemoveDevice = Device => { type: string, payload: Device }
export const removeDevice: RemoveDevice = payload => ({
  type: 'REMOVE_DEVICE',
  payload,
})

type UpdateDevices = Devices => { type: string, payload: Devices }
export const updateDevices: UpdateDevices = payload => ({
  type: 'UPDATE_DEVICES',
  payload,
})
