// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import withLibcore from 'helpers/withLibcore'

type Input = void
type Result = boolean

const cmd: Command<Input, Result> = createCommand(
  'libcoreReset',
  () => from(withLibcore(core => core.getPoolInstance().freshResetAll()))
)

export default cmd
