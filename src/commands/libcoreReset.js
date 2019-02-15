// @flow

import { createCommand, Command } from 'helpers/ipc'
import { of } from 'rxjs'
import withLibcore from 'helpers/withLibcore'

type Input = void
type Result = boolean

const cmd: Command<Input, Result> = createCommand('libcoreReset', () => {
  withLibcore(core => core.getPoolInstance().freshResetAll())
  return of(true)
})

export default cmd
