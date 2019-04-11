// @flow

import { map } from 'rxjs/operators'
import signAndBroadcast from '@ledgerhq/live-common/lib/libcore/signAndBroadcast'
import type { OperationRaw, DerivationMode } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'
import { operationToRow } from 'helpers/accountModel'

type Input = {
  accountId: string,
  blockHeight: number,
  currencyId: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
  xpub: string,
  index: number,
  transaction: *,
  deviceId: string,
}

type Result =
  | { type: 'signing' }
  | { type: 'signed' }
  | { type: 'broadcasted', operation: OperationRaw }

const cmd: Command<Input, Result> = createCommand('libcoreSignAndBroadcast', input =>
  signAndBroadcast(input).pipe(
    map(
      (e: *): Result => {
        if (e.type === 'broadcasted') {
          const operation: OperationRaw = operationToRow(e.operation)
          return { type: 'broadcasted', operation }
        }
        return e
      },
    ),
  ),
)

export default cmd
