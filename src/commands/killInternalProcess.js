// @flow

import { createCommand, Command } from 'helpers/ipc'
import { of } from 'rxjs'

type Input = void
type Result = boolean

const cmd: Command<Input, Result> = createCommand('killInternalProcess', () => {
  setTimeout(() => {
    // we assume commands are run on the internal process
    // special exit code for better identification
    process.exit(42)
  })
  return of(true)
})

export default cmd
