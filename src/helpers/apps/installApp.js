// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL } from 'helpers/constants'
import { createDeviceSocket } from 'helpers/socket'

import type { LedgerScriptParams } from 'helpers/common'

/**
 * Install an app on the device
 */
export default async function installApp(
  transport: Transport<*>,
  { appParams }: { appParams: LedgerScriptParams },
): Promise<*> {
  const url = `${BASE_SOCKET_URL}/install?${qs.stringify(appParams)}`
  return createDeviceSocket(transport, url).toPromise()
}
