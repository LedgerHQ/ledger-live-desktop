// @flow

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'
import { syncAccount } from 'helpers/libcore'

type Input = {
  rawAccount: AccountRaw,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'accounts',
  'libcoreSyncAccount',
  ({ rawAccount }) =>
    Observable.create(o => {
      // TODO scanAccountsOnDevice should directly return a Observable so we just have to pass-in
      syncAccount({ rawAccount }).then(
        () => {
          o.complete()
        },
        e => {
          o.error(e)
        },
      )

      function unsubscribe() {
        // FIXME not implemented
      }

      return unsubscribe
    }),
)

export default cmd
