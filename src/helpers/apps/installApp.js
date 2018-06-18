// @flow

import type Transport from '@ledgerhq/hw-transport'

import { createSocketDialog } from 'helpers/common'
import type { LedgerScriptParams } from 'helpers/common'

/**
 * Install an app on the device
 */
export default async function installApp(
  transport: Transport<*>,
  { appParams }: { appParams: LedgerScriptParams },
): Promise<*> {
  return createSocketDialog(transport, '/install', appParams)
}
