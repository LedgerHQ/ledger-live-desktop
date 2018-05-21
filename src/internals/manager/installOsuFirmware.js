// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import type { IPCSend } from 'types/electron'
import { createSocketDialog, buildParamsFromFirmware } from './helpers'

type DataType = {
  devicePath: string,
  firmware: Object,
}

const buildOsuParams = buildParamsFromFirmware('osu')

export default async (send: IPCSend, data: DataType) => {
  try {
    const transport = await CommNodeHid.open(data.devicePath)
    const osuData = buildOsuParams(data.firmware)
    await createSocketDialog(transport, '/update/install', osuData)
    send('device.osuFirmwareInstallSuccess', { success: true })
  } catch (err) {
    send('device.osuFirmwareInstallError', { success: false })
  }
}
