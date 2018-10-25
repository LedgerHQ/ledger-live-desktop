// @flow

import type { AccountRaw, DerivationMode } from '@ledgerhq/live-common/lib/types'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { syncAccount } from 'helpers/libcore'
import withLibcore from 'helpers/withLibcore'

type Input = {
  accountId: string,
  currencyId: string,
  xpub: string,
  derivationMode: DerivationMode,
  seedIdentifier: string,
  index: number,
}

type Result = { rawAccount: AccountRaw, requiresCacheFlush: boolean }

const cmd: Command<Input, Result> = createCommand(
  'libcoreSyncAccount',
  ({ currencyId, ...accountInfos }) =>
    fromPromise(
      withLibcore(core => {
        const currency = getCryptoCurrencyById(currencyId)
        return syncAccount({ ...accountInfos, currency, core })
      }),
    ),
)

export default cmd
