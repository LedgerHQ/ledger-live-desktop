// @flow

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { syncAccount } from 'helpers/libcore'
import withLibcore from 'helpers/withLibcore'

type Input = {
  accountId: string,
  freshAddressPath: string,
  currencyId: string,
  index: number,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand('libcoreSyncAccount', accountInfos =>
  fromPromise(withLibcore(core => syncAccount({ ...accountInfos, core }))),
)

export default cmd
