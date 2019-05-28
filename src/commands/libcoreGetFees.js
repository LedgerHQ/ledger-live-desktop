// @flow

import { from } from 'rxjs'
import { createCommand, Command } from 'helpers/ipc'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { fromAccountRaw } from '@ledgerhq/live-common/lib/account'
import { getFeesForTransaction } from '@ledgerhq/live-common/lib/libcore/getFeesForTransaction'

type Input = {
  accountRaw: AccountRaw,
  transaction: *,
}

type Result = string

const cmd: Command<Input, Result> = createCommand('libcoreGetFees', ({ accountRaw, transaction }) =>
  from(
    getFeesForTransaction({
      account: fromAccountRaw(accountRaw),
      transaction,
    }).then(fees => fees.toString()),
  ),
)

export default cmd
