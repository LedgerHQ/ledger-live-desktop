// @flow

import { from } from 'rxjs'
import { createCommand, Command } from 'helpers/ipc'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { getFeesForTransaction } from '@ledgerhq/live-common/lib/libcore/getFeesForTransaction'
import { decodeAccount } from 'reducers/accounts'

type Input = {
  accountRaw: AccountRaw,
  transaction: *,
}

type Result = {
  totalFees: string,
}

const cmd: Command<Input, Result> = createCommand('libcoreGetFees', ({ accountRaw, transaction }) =>
  from(
    getFeesForTransaction({
      account: decodeAccount(accountRaw),
      transaction,
    }).then(fees => ({
      totalFees: fees.toString(),
    })),
  ),
)

export default cmd
