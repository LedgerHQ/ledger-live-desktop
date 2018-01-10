// @flow

// eslint-disable import/prefer-default-export

import type { Dispatch } from 'redux'

import { getDevices } from 'reducers/devices'

import type { Device, Devices } from 'types/common'

type deviceChooseType = (?Device) => { type: string, payload: ?Device }
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

  const devices = getDevices(getState())

  // If we don't detect any device we reset currentDevice
  if (devices.length === 0) {
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
