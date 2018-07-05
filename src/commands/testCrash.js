// @flow

// This is a test example for dev testing purpose.

import { createCommand, Command } from 'helpers/ipc'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('testCrash', () => {
  // $FlowFixMe
  crashTest() // eslint-disable-line
  throw new Error()
})

export default cmd
