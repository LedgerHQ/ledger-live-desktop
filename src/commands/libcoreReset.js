// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { reset } from '@ledgerhq/live-common/lib/libcore/access'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('libcoreReset', () => from(reset()))

export default cmd
