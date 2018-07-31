// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL } from 'config/constants'
import { createDeviceSocket } from 'helpers/socket'

import type { LedgerScriptParams } from 'helpers/types'

import { createCustomErrorClass } from 'helpers/errors'

const ManagerNotEnoughSpaceError = createCustomErrorClass('ManagerNotEnoughSpace')
const ManagerDeviceLockedError = createCustomErrorClass('ManagerDeviceLocked')
const ManagerAppAlreadyInstalledError = createCustomErrorClass('ManagerAppAlreadyInstalled')
const ManagerAppRelyOnBTCError = createCustomErrorClass('ManagerAppRelyOnBTC')

function remapError(promise) {
  return promise.catch((e: Error) => {
    switch (true) {
      case e.message.endsWith('6982'):
        throw new ManagerDeviceLockedError()
      case e.message.endsWith('6a84') || e.message.endsWith('6a85'):
        throw new ManagerNotEnoughSpaceError()
      case e.message.endsWith('6a80') || e.message.endsWith('6a81'):
        throw new ManagerAppAlreadyInstalledError()
      case e.message.endsWith('6a83'):
        throw new ManagerAppRelyOnBTCError()
      default:
        throw e
    }
  })
}

/**
 * Install an app on the device
 */
export default async function installApp(
  transport: Transport<*>,
  targetId: string | number,
  { app }: { app: LedgerScriptParams },
): Promise<*> {
  const params = {
    targetId,
    perso: app.perso,
    deleteKey: app.delete_key,
    firmware: app.firmware,
    firmwareKey: app.firmware_key,
    hash: app.hash,
  }
  const url = `${BASE_SOCKET_URL}/install?${qs.stringify(params)}`
  return remapError(createDeviceSocket(transport, url).toPromise())
}
