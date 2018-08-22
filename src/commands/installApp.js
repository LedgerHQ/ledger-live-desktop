// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installApp from 'helpers/apps/installApp'

import type { LedgerScriptParams } from 'helpers/types'

type Input = {
  app: LedgerScriptParams,
  devicePath: string,
  targetId: string | number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'installApp',
  ({ devicePath, targetId, ...app }) =>
    fromPromise(withDevice(devicePath)(transport => installApp(transport, targetId, app))),
)

export default cmd
