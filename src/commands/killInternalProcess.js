// @flow

import { createCommand, Command } from 'helpers/ipc'
import { never } from 'rxjs'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('killInternalProcess', () => {
  setTimeout(() => {
    // we assume commands are run on the internal process
    // special exit code for better identification
    process.exit(42)
  })
  // The command shouldn't finish now because process.exit will make it end!
  return never()
})

export default cmd
