// @flow

import { map } from 'rxjs/operators'
import { toOperationRaw, fromAccountRaw } from '@ledgerhq/live-common/lib/account'
import signAndBroadcast from '@ledgerhq/live-common/lib/libcore/signAndBroadcast'
import type { Transaction, AccountRaw, OperationRaw } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  account: AccountRaw,
  transaction: Transaction,
  deviceId: string,
}

type Result =
  | { type: 'signing' }
  | { type: 'signed' }
  | { type: 'broadcasted', operation: OperationRaw }

const cmd: Command<Input, Result> = createCommand('libcoreSignAndBroadcast', input =>
  signAndBroadcast({
    account: fromAccountRaw(input.account),
    transaction: input.transaction,
    deviceId: input.deviceId,
  }).pipe(
    map((e: *): Result => {
      if (e.type === 'broadcasted') {
        const operation: OperationRaw = toOperationRaw(e.operation, true)
        return { type: 'broadcasted', operation }
      }
      return e
    }),
  ),
)

export default cmd
