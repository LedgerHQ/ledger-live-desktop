// @flow
import type Transport from '@ledgerhq/hw-transport'
import { createSocketDialog } from 'helpers/common'
import { SKIP_GENUINE } from 'config/constants'

export default async (
  transport: Transport<*>,
  { targetId }: { targetId: string | number },
): Promise<string> =>
  SKIP_GENUINE
    ? new Promise(resolve => setTimeout(() => resolve('0000'), 1000))
    : createSocketDialog(transport, '/genuine', { targetId }, true)
