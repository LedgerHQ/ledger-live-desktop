// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'

import type { Firmware } from 'components/modals/UpdateFirmware'

import { createCustomErrorClass } from '../errors'

const ManagerNotEnoughSpaceError = createCustomErrorClass('ManagerNotEnoughSpace')
const ManagerDeviceLockedError = createCustomErrorClass('ManagerDeviceLocked')
const UserRefusedFirmwareUpdate = createCustomErrorClass('UserRefusedFirmwareUpdate')

function remapError(promise) {
  return promise.catch((e: Error) => {
    switch (true) {
      case e.message.endsWith('6985'):
        throw new UserRefusedFirmwareUpdate()
      case e.message.endsWith('6982'):
        throw new ManagerDeviceLockedError()
      case e.message.endsWith('6a84') || e.message.endsWith('6a85'):
        throw new ManagerNotEnoughSpaceError()
      default:
        throw e
    }
  })
}

type Result = Promise<{ success: boolean, error?: any }>

export default async (
  transport: Transport<*>,
  targetId: string | number,
  firmware: Firmware,
): Result => {
  try {
    const params = {
      targetId,
      ...firmware,
      firmwareKey: firmware.firmware_key,
    }
    delete params.shouldFlashMcu
    const url = WS_INSTALL(params)
    await remapError(createDeviceSocket(transport, url).toPromise())
    return { success: true }
  } catch (error) {
    throw error
  }
}
