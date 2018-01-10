// @flow

// eslint-disable import/prefer-default-export

import type { Dispatch } from 'redux'

import { getDevices, getCurrentDevice } from 'reducers/devices'

import type { Device, Devices } from 'types/common'

export type deviceChooseType = (Device | null) => { type: string, payload: Device | null }
export const deviceChoose: deviceChooseType = payload => ({
  type: 'DEVICE_CHOOSE',
  payload,
})

type deviceChooseFirstType = () => (Dispatch<any>, () => { devices: Devices }) => void
export const deviceChooseFirst: deviceChooseFirstType = () => (dispatch, getState) => {
  const devices = getDevices(getState())

  // If we detect only 1 device, we choose it
  if (devices.length === 1) {
    dispatch(deviceChoose(devices[0]))
  }
}

type devicesAddType = Device => (Dispatch<any>) => void
export const deviceAdd: devicesAddType = payload => dispatch => {
  dispatch({
    type: 'DEVICE_ADD',
    payload,
  })

  dispatch(deviceChooseFirst())
}

type devicesRemoveType = Device => (Dispatch<any>, () => { devices: Devices }) => void
export const deviceRemove: devicesRemoveType = payload => (dispatch, getState) => {
  dispatch({
    type: 'DEVICE_REMOVE',
    payload,
  })

  const currentDevice = getCurrentDevice(getState())

  // If we disconnect the currentDevice we reset it
  if (currentDevice.path === payload.path) {
    dispatch(deviceChoose(null))
  }
}

type devicesUpdateType = Devices => (Dispatch<any>) => void
export const devicesUpdate: devicesUpdateType = payload => dispatch => {
  dispatch({
    type: 'DEVICES_UPDATE',
    payload,
  })

  dispatch(deviceChooseFirst())
}
