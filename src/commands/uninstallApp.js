// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import uninstallApp from 'helpers/apps/uninstallApp'

import type { LedgerScriptParams } from 'helpers/types'

type Input = {
  app: LedgerScriptParams,
  devicePath: string,
  targetId: string | number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'uninstallApp',
  ({ devicePath, targetId, ...rest }) =>
    fromPromise(withDevice(devicePath)(transport => uninstallApp(transport, targetId, rest))),
)

export default cmd
