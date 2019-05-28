// @flow

import type { AccountRaw, Account } from '@ledgerhq/live-common/lib/types'
import { syncAccount } from '@ledgerhq/live-common/lib/libcore/syncAccount'
import { reduce, map } from 'rxjs/operators'

import { createCommand, Command } from 'helpers/ipc'
import { fromAccountRaw, toAccountRaw } from '@ledgerhq/live-common/lib/account'

type Input = AccountRaw
type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand('libcoreSyncAccount', rawAccount => {
  const account = fromAccountRaw(rawAccount)
  return syncAccount(account)
    .pipe(reduce((acc, updater: Account => Account) => updater(acc), account))
    .pipe(map(account => toAccountRaw(account)))
})

export default cmd
