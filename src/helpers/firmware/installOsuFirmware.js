// @flow

import type Transport from '@ledgerhq/hw-transport'

import { createSocketDialog, buildParamsFromFirmware } from 'helpers/common'

type Input = {
  devicePath: string,
  firmware: Object,
}

type Result = Promise<{ success: boolean, error?: any }>

const buildOsuParams = buildParamsFromFirmware('osu')

export default async (transport: Transport<*>, data: Input): Result => {
  try {
    const osuData = buildOsuParams(data.firmware)
    await createSocketDialog(transport, '/update/install', osuData)
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
