// @flow

import type { AccountRaw, Account } from '@ledgerhq/live-common/lib/types'
import { syncAccount } from '@ledgerhq/live-common/lib/libcore/syncAccount'
import { reduce, map } from 'rxjs/operators'

import { createCommand, Command } from 'helpers/ipc'
import { fromAccountRaw, toAccountRaw } from '@ledgerhq/live-common/lib/account'

type Input = {
  rawAccount: AccountRaw,
}

type Result = {
  rawAccount: AccountRaw,
  requiresCacheFlush: boolean,
}

const cmd: Command<Input, Result> = createCommand('libcoreSyncAccount', ({ rawAccount }) => {
  const account = fromAccountRaw(rawAccount)
  return syncAccount(account)
    .pipe(reduce((acc, updater: Account => Account) => updater(acc), account))
    .pipe(
      map(account => ({
        rawAccount: toAccountRaw(account),
        requiresCacheFlush: false, // TODO to determine that, we would have to know if account was recreated!
      })),
    )
})

export default cmd
