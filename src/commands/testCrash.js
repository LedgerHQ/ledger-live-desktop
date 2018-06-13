// @flow

// This is a test example for dev testing purpose.

import { Observable } from 'rxjs'
import { createCommand, Command } from 'helpers/ipc'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('testCrash', () => Observable.create(() => {
    process.exit(1)
  }))

export default cmd
