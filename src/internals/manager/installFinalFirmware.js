// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import type { IPCSend } from 'types/electron'
import { createSocketDialog, buildParamsFromFirmware } from './helpers'

type DataType = {
  devicePath: string,
  firmware: Object,
}

const buildFinalParams = buildParamsFromFirmware('final')

export default async (send: IPCSend, data: DataType) => {
  try {
    const transport = await CommNodeHid.open(data.devicePath)
    const finalData = buildFinalParams(data.firmware)
    await createSocketDialog(transport, '/update/install', finalData)
    send('device.finalFirmwareInstallSuccess', { success: true })
  } catch (err) {
    send('device.finalFirmwareInstallError', { success: false })
  }
}
