// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_MCU } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getNextMCU from 'helpers/firmware/getNextMCU'
import getDeviceInfo from 'helpers/devices/getDeviceInfo'

type Result = Promise<*>

export default async (transport: Transport<*>): Result => {
  const deviceInfo = await getDeviceInfo(transport)
  const { seVersion: version, targetId } = deviceInfo
  const nextVersion = await getNextMCU(version)
  const params = {
    targetId,
    version: nextVersion.name,
  }
  const url = WS_MCU(params)
  return createDeviceSocket(transport, url).toPromise()
}
