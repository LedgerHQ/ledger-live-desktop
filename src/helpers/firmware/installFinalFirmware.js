// @flow
import qs from 'qs'
import type Transport from '@ledgerhq/hw-transport'

import { BASE_SOCKET_URL_SECURE } from 'config/constants'
import { createDeviceSocket } from 'helpers/socket'
import { buildParamsFromFirmware } from 'helpers/common'

type Input = Object
type Result = *

const buildFinalParams = buildParamsFromFirmware('final')

export default async (transport: Transport<*>, firmware: Input): Result => {
  try {
    const finalData = buildFinalParams(firmware)
    const url = `${BASE_SOCKET_URL_SECURE}/install?${qs.stringify(finalData)}`
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
