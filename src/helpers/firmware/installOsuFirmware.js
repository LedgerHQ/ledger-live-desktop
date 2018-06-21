// @flow
import type Transport from '@ledgerhq/hw-transport'

import { WS_INSTALL } from 'helpers/urls'
import { createDeviceSocket } from 'helpers/socket'

import type { LedgerScriptParams } from 'helpers/common'

type Result = Promise<{ success: boolean, error?: any }>

export default async (
  transport: Transport<*>,
  targetId: string | number,
  firmware: LedgerScriptParams,
): Result => {
  try {
    const params = {
      targetId,
      ...firmware,
      firmwareKey: firmware.firmware_key,
    }
    const url = WS_INSTALL(params)
    await createDeviceSocket(transport, url).toPromise()
    return { success: true }
  } catch (error) {
    const result = { success: false, error }
    throw result
  }
}
