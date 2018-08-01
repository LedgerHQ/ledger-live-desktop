// @flow
import type Transport from '@ledgerhq/hw-transport'

import { createDeviceSocket } from 'helpers/socket'

import type { ApplicationVersion } from 'helpers/types'
import { WS_INSTALL } from 'helpers/urls'

import {
  ManagerNotEnoughSpaceError,
  ManagerDeviceLockedError,
  ManagerAppAlreadyInstalledError,
  ManagerAppRelyOnBTCError,
} from 'config/errors'

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
  { app }: { app: ApplicationVersion },
): Promise<void> {
  const params = {
    targetId,
    perso: app.perso,
    deleteKey: app.delete_key,
    firmware: app.firmware,
    firmwareKey: app.firmware_key,
    hash: app.hash,
  }

  const url = WS_INSTALL(params)
  await remapError(createDeviceSocket(transport, url).toPromise())
}
