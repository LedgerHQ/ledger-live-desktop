// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { MANAGER_API_URL } from 'helpers/constants'
import { createDeviceSocket } from 'helpers/socket'

type Result = Promise<*>

export default async (
  transport: Transport<*>,
  params: { targetId: string | number, version: string },
): Result => {
  const url = `${MANAGER_API_URL}/mcu?${qs.stringify(params)}`
  return createDeviceSocket(transport, url).toPromise()
}
