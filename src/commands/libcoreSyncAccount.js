// @flow

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { syncAccount } from 'helpers/libcore'
import withLibcore from 'helpers/withLibcore'

type Input = {
  rawAccount: AccountRaw,
}

type Result = AccountRaw

const cmd: Command<Input, Result> = createCommand('libcoreSyncAccount', ({ rawAccount }) =>
  fromPromise(withLibcore(core => syncAccount({ rawAccount, core }))),
)

export default cmd
