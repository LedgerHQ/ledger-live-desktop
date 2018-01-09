// @flow

// eslint-disable import/prefer-default-export

import type { Device } from 'types/common'

type devicesUpdateType = (Array<Device>) => { type: string, payload: Array<Device> }
export const devicesUpdate: devicesUpdateType = payload => ({
  type: 'DEVICES_UPDATE',
  payload,
})

type devicesAddType = Device => { type: string, payload: Device }
export const deviceAdd: devicesAddType = payload => ({
  type: 'DEVICE_ADD',
  payload,
})

type devicesRemoveType = Device => { type: string, payload: Device }
export const deviceRemove: devicesRemoveType = payload => ({
  type: 'DEVICE_REMOVE',
  payload,
})
