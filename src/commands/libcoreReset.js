// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { deleteLibcore, withLibcore } from '@ledgerhq/live-common/lib/libcore/access'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('libcoreReset', () =>
  from(withLibcore(core => core.getPoolInstance().freshResetAll()).then(_ => deleteLibcore())),
)

export default cmd
