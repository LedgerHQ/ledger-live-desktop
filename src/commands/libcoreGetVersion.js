// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

type Input = void

type Result = { stringVersion: string, intVersion: number }

const cmd: Command<Input, Result> = createCommand('libcoreGetVersion', () =>
  fromPromise(
    Promise.resolve().then(() => {
      const ledgerCore = require('init-ledger-core')()
      const core = new ledgerCore.NJSLedgerCore()
      const stringVersion = core.getStringVersion()
      const intVersion = core.getIntVersion()
      return { stringVersion, intVersion }
    }),
  ),
)

export default cmd
