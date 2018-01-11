// @flow

// eslint-disable import/prefer-default-export

import type { Device, Devices } from 'types/common'

export type deviceChooseType = (Device | null) => { type: string, payload: Device | null }
export const deviceChoose: deviceChooseType = payload => ({
  type: 'DEVICE_CHOOSE',
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

type devicesUpdateType = Devices => { type: string, payload: Devices }
export const devicesUpdate: devicesUpdateType = payload => ({
  type: 'DEVICES_UPDATE',
  payload,
})
