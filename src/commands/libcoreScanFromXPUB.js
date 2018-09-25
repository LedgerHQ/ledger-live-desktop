// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'
import type { AccountRaw } from '@ledgerhq/live-common/lib/types'

import { createCommand, Command } from 'helpers/ipc'
import withLibcore from 'helpers/withLibcore'
import { scanAccountsFromXPUB } from 'helpers/libcore'

type Input = {
  currencyId: string,
  xpub: string,
  isSegwit: boolean,
  isUnsplit: boolean,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanFromXPUB',
  ({ currencyId, xpub, isSegwit, isUnsplit }) =>
    fromPromise(
      withLibcore(async core =>
        scanAccountsFromXPUB({ core, currencyId, xpub, isSegwit, isUnsplit }),
      ),
    ),
)

export default cmd
