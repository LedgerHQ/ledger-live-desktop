// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_MCU } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getNextMCU from 'helpers/firmware/getNextMCU'
import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import { ManagerDeviceLockedError } from 'config/errors'

import type { DeviceInfo } from 'helpers/types'

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

type Result = Promise<void>

export default async (transport: Transport<*>): Result => {
  const { seVersion: version, targetId }: DeviceInfo = await getDeviceInfo(transport)
  const nextVersion = await getNextMCU(version)
  const params = {
    targetId,
    version: nextVersion.name,
  }
  const url = WS_MCU(params)
  await remapSocketError(createDeviceSocket(transport, url).toPromise())
}
