// @flow
import type Transport from '@ledgerhq/hw-transport'
import { SKIP_GENUINE } from 'config/constants'
import { WS_GENUINE } from 'helpers/urls'

import { createDeviceSocket } from 'helpers/socket'
import getCurrentFirmware from './getCurrentFirmware'
import getDeviceVersion from './getDeviceVersion'

export default async (
  transport: Transport<*>,
  app: { targetId: string | number, version: string },
): Promise<string> => {
  const { targetId, version } = app
  const device = await getDeviceVersion(app.targetId)
  const firmware = await getCurrentFirmware({ deviceId: device.id, version })
  const params = {
    targetId,
    version,
    perso: firmware.perso,
  }
  const url = WS_GENUINE(params)
  return SKIP_GENUINE
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createDeviceSocket(transport, url).toPromise()
}
