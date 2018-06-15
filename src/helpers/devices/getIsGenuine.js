// @flow
import type Transport from '@ledgerhq/hw-transport'
import { createSocketDialog } from 'helpers/common'

export default async (
  transport: Transport<*>,
  { targetId }: { targetId: string | number },
): Promise<*> =>
  process.env.SKIP_GENUINE > 0
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createSocketDialog(transport, '/genuine', { targetId }, true)
