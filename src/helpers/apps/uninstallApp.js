// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL_SECURE } from 'config/constants'
import { createDeviceSocket } from 'helpers/socket'

import type { LedgerScriptParams } from 'helpers/common'
import { createCustomErrorClass } from '../errors'

const ManagerDeviceLockedError = createCustomErrorClass('ManagerDeviceLocked')
const ManagerUninstallBTCDep = createCustomErrorClass('ManagerUninstallBTCDep')

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
  { app }: { app: LedgerScriptParams },
): Promise<*> {
  const params = {
    targetId,
    ...app,
    firmware: app.delete,
    firmwareKey: app.delete_key,
  }
  const url = `${BASE_SOCKET_URL_SECURE}/install?${qs.stringify(params)}`
  return remapError(createDeviceSocket(transport, url).toPromise())
}
