// @flow

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'
import { scanAccountsOnDevice } from 'helpers/libcore'
import withLibcore from 'helpers/withLibcore'

type Input = {
  devicePath: string,
  currencyId: string,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanAccounts',
  ({ devicePath, currencyId }) =>
    Observable.create(o => {
      // TODO scanAccountsOnDevice should directly return a Observable so we just have to pass-in
      withLibcore(core =>
        scanAccountsOnDevice({
          core,
          devicePath,
          currencyId,
          onAccountScanned: account => {
            o.next(account)
          },
        }).then(
          () => {
            o.complete()
          },
          e => {
            o.error(e)
          },
        ),
      )

      function unsubscribe() {
        // FIXME not implemented
      }

      return unsubscribe
    }),
)

export default cmd
