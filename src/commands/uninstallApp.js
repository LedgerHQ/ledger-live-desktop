// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import uninstallApp from 'helpers/apps/uninstallApp'

import type { LedgerScriptParams } from 'helpers/common'

type Input = {
  appParams: LedgerScriptParams,
  devicePath: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'devices',
  'uninstallApp',
  ({ devicePath, ...rest }) =>
    fromPromise(withDevice(devicePath)(transport => uninstallApp(transport, rest))),
)

export default cmd
