// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { withLibcore } from '@ledgerhq/live-common/lib/libcore/access'

type Input = void
type Result = string

const cmd: Command<Input, Result> = createCommand('libcoreGetPoolName', () =>
  fromPromise(withLibcore(async core => core.getPoolInstance().getName())),
)

export default cmd
