// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'
import { SKIP_GENUINE, BASE_SOCKET_URL_SECURE } from 'config/constants'

import { createDeviceSocket } from 'helpers/socket'

export default async (
  transport: Transport<*>,
  params: { targetId: string | number },
): Promise<string> => {
  const url = `${BASE_SOCKET_URL_SECURE}/genuine?${qs.stringify(params)}`
  return SKIP_GENUINE
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createDeviceSocket(transport, url).toPromise()
}
