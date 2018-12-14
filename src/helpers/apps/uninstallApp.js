// @flow
import type Transport from '@ledgerhq/hw-transport'

import { createDeviceSocket } from 'helpers/socket'

import type { ApplicationVersion } from 'helpers/types'
import { ManagerDeviceLockedError, ManagerUninstallBTCDep } from '@ledgerhq/live-common/lib/errors'
import { WS_INSTALL } from 'helpers/urls'

function remapError(promise) {
  return promise.catch((e: Error) => {
    switch (true) {
      case e.message.endsWith('6982'):
        throw new ManagerDeviceLockedError()
      case e.message.endsWith('6a83'):
        throw new ManagerUninstallBTCDep()
      default:
        throw e
    }
  })
}

/**
 * Install an app on the device
 */
export default async function uninstallApp(
  transport: Transport<*>,
  targetId: string | number,
  { app }: { app: ApplicationVersion },
): Promise<void> {
  const params = {
    targetId,
    perso: app.perso,
    deleteKey: app.delete_key,
    firmware: app.delete,
    firmwareKey: app.delete_key,
    hash: app.hash,
  }
  const url = WS_INSTALL(params)
  await remapError(createDeviceSocket(transport, url).toPromise())
}
