// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL } from 'helpers/constants'
import { createDeviceSocket } from 'helpers/socket'
import { buildParamsFromFirmware } from 'helpers/common'

type Input = Object

type Result = Promise<{ success: boolean, error?: any }>

const buildOsuParams = buildParamsFromFirmware('osu')

export default async (transport: Transport<*>, firmware: Input): Result => {
  try {
    const osuData = buildOsuParams(firmware)
    const url = `${BASE_SOCKET_URL}/install?${qs.stringify(osuData)}`
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
