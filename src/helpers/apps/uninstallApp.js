// @flow

import type Transport from '@ledgerhq/hw-transport'

import { createSocketDialog } from 'helpers/common'
import type { LedgerScriptParams } from 'helpers/common'

/**
 * Install an app on the device
 */
export default async function uninstallApp(
  transport: Transport<*>,
  { appParams }: { appParams: LedgerScriptParams },
): Promise<*> {
  const params = {
    ...appParams,
    firmware: appParams.delete,
    firmwareKey: appParams.deleteKey,
  }
  return createSocketDialog(transport, '/install', params)
}
