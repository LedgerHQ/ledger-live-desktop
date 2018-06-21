// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_MCU } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getNextMCU from 'helpers/devices/getNextMCU'

type Result = Promise<*>

export default async (
  transport: Transport<*>,
  args: { targetId: string | number, version: string },
): Result => {
  const { version } = args
  const nextVersion = await getNextMCU(version)
  const params = {
    targetId: args.targetId,
    version: nextVersion.name,
  }
  const url = WS_MCU(params)
  return createDeviceSocket(transport, url).toPromise()
}
