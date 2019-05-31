// @flow

import type { Device } from 'types/common'

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

export const resetDevices = () => ({
  type: 'RESET_DEVICES',
})
