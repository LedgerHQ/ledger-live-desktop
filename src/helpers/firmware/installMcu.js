// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_MCU } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getNextMCU from 'helpers/firmware/getNextMCU'
import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import { createCustomErrorClass } from 'helpers/errors'

const ManagerDeviceLockedError = createCustomErrorClass('ManagerDeviceLocked')

function remapSocketError(promise) {
  return promise.catch((e: Error) => {
    switch (true) {
      case e.message.endsWith('6982'):
        throw new ManagerDeviceLockedError()
      default:
        throw e
    }
  })
}

type Result = Promise<*>

export default async (transport: Transport<*>): Result => {
  const deviceInfo = await getDeviceInfo(transport)
  const { seVersion: version, targetId } = deviceInfo
  const nextVersion = await getNextMCU(version)
  const params = {
    targetId,
    version: nextVersion.name,
  }
  const url = WS_MCU(params)
  return remapSocketError(createDeviceSocket(transport, url).toPromise())
}
