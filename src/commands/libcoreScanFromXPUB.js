// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'
import type { AccountRaw, DerivationMode } from '@ledgerhq/live-common/lib/types'

import { createCommand, Command } from 'helpers/ipc'
import withLibcore from 'helpers/withLibcore'
import { scanAccountsFromXPUB } from 'helpers/libcore'

type Input = {
  currencyId: string,
  xpub: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand(
  'libcoreScanFromXPUB',
  ({ currencyId, xpub, derivationMode, seedIdentifier }) =>
    fromPromise(
      withLibcore(async core =>
        scanAccountsFromXPUB({ core, currencyId, xpub, derivationMode, seedIdentifier }),
      ),
    ),
)

export default cmd
