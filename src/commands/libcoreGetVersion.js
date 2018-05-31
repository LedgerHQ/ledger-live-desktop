// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import withLibcore from 'helpers/withLibcore'

type Input = void

type Result = { stringVersion: string, intVersion: number }

const cmd: Command<Input, Result> = createCommand('libcoreGetVersion', () =>
  fromPromise(
    withLibcore(ledgerCore => {
      const core = new ledgerCore.NJSLedgerCore()
      const stringVersion = core.getStringVersion()
      const intVersion = core.getIntVersion()
      return { stringVersion, intVersion }
    }),
  ),
)

export default cmd
