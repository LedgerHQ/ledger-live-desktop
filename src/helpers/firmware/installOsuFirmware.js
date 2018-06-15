// @flow

import type Transport from '@ledgerhq/hw-transport'

import { createSocketDialog, buildParamsFromFirmware } from 'helpers/common'

type Input = Object

type Result = Promise<{ success: boolean, error?: any }>

const buildOsuParams = buildParamsFromFirmware('osu')

export default async (transport: Transport<*>, firmware: Input): Result => {
  try {
    const osuData = buildOsuParams(firmware)
    await createSocketDialog(transport, '/install', osuData)
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
