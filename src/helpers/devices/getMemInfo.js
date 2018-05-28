// @flow

import type Transport from '@ledgerhq/hw-transport'

import { getFirmwareInfo, createSocketDialog } from 'helpers/common'

export default async function getMemInfos(transport: Transport<*>): Promise<Object> {
  const { targetId } = await getFirmwareInfo(transport)
  // Dont ask me about this `perso_11`: I don't know. But we need it.
  return createSocketDialog(transport, '/get-mem-infos', { targetId, perso: 'perso_11' })
}
