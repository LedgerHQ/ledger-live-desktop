// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { withLibcore } from '@ledgerhq/live-common/lib/libcore/access'

type Input = void

type Result = { stringVersion: string, intVersion: number }

const cmd: Command<Input, Result> = createCommand('libcoreGetVersion', () =>
  fromPromise(
    withLibcore(async ledgerCore => {
      const stringVersion = await ledgerCore.LedgerCore.getStringVersion()
      const intVersion = await ledgerCore.LedgerCore.getIntVersion()
      return { stringVersion, intVersion }
    }),
  ),
)

export default cmd
