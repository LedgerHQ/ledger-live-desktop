// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'
import { SKIP_GENUINE } from 'config/constants'
import { WS_GENUINE } from 'helpers/urls'

import { createDeviceSocket } from 'helpers/socket'

export default async (
  transport: Transport<*>,
  params: { targetId: string | number },
): Promise<string> => {
  const url = WS_GENUINE(params)
  return SKIP_GENUINE
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createDeviceSocket(transport, url).toPromise()
}
