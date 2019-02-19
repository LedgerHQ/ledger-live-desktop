// @flow
import { getDeviceModel } from '@ledgerhq/devices'

import type { DeviceType } from 'reducers/onboarding'

export const deviceModelName = (id: DeviceType): string => {
  const device = getDeviceModel(id)
  if (device) return device.productName

  return ''
}

export const cleanDeviceName = (id: DeviceType): string => {
  const fullName = deviceModelName(id)
  if (fullName) return fullName.split('Ledger ')[1]

  return ''
}
