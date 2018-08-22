// @flow
import type Transport from '@ledgerhq/hw-transport'
import { SKIP_GENUINE } from 'config/constants'
import { WS_GENUINE } from 'helpers/urls'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import { createDeviceSocket } from 'helpers/socket'
import getCurrentFirmware from './getCurrentFirmware'
import getDeviceVersion from './getDeviceVersion'

export default async (transport: Transport<*>, deviceInfo: DeviceInfo): Promise<string> => {
  const deviceVersion = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)
  const firmware = await getCurrentFirmware({
    deviceId: deviceVersion.id,
    fullVersion: deviceInfo.fullVersion,
    provider: deviceInfo.providerId,
  })
  const params = {
    targetId: deviceInfo.targetId,
    perso: firmware.perso,
  }
  const url = WS_GENUINE(params)
  return SKIP_GENUINE
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createDeviceSocket(transport, url).toPromise()
}
