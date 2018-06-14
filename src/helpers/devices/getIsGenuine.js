// @flow
import type Transport from '@ledgerhq/hw-transport'
import { createSocketDialog } from 'helpers/common'

export default async (
  transport: Transport<*>,
  { targetId }: { targetId: string | number },
): Promise<*> => createSocketDialog(transport, '/genuine', { targetId }, true)
