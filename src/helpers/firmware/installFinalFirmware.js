// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'

type Input = Object
type Result = *

export default async (transport: Transport<*>, firmware: Input): Result => {
  try {
    const url = WS_INSTALL(firmware)
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    const result = { success: false, error }
    throw result
  }
}
