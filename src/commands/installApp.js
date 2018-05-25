// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import installApp from 'helpers/apps/installApp'

import type { LedgerScriptParams } from 'helpers/common'

type Input = {
  appParams: LedgerScriptParams,
  devicePath: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'devices',
  'installApp',
  ({ devicePath, ...rest }) =>
    fromPromise(withDevice(devicePath)(transport => installApp(transport, rest))),
)

export default cmd
