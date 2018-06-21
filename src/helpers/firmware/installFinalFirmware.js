// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'
import getDeviceVersion from 'helpers/devices/getDeviceVersion'
import getOsuFirmware from 'helpers/devices/getOsuFirmware'
import getFinalFirmwareById from './getFinalFirmwareById'

type Input = {
  targetId: number | string,
  version: string,
}
type Result = *

export default async (transport: Transport<*>, app: Input): Result => {
  try {
    const { targetId, version } = app
    const device = await getDeviceVersion(targetId)
    const firmware = await getOsuFirmware({ deviceId: device.id, version })
    const { next_se_firmware_final_version } = firmware
    const nextFirmware = await getFinalFirmwareById(next_se_firmware_final_version)

    const params = {
      targetId,
      ...nextFirmware,
      firmwareKey: nextFirmware.firmware_key,
    }

    const url = WS_INSTALL(params)
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
