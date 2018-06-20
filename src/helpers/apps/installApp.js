// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL_SECURE } from 'config/constants'
import { createDeviceSocket } from 'helpers/socket'

import type { LedgerScriptParams } from 'helpers/common'

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
    ...app,
    firmwareKey: app.firmware_key,
  }
  const url = `${BASE_SOCKET_URL_SECURE}/install?${qs.stringify(params)}`
  return createDeviceSocket(transport, url).toPromise()
}
