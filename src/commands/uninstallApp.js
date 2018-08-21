// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import uninstallApp from 'helpers/apps/uninstallApp'

import type { ApplicationVersion } from 'helpers/types'

type Input = {
  app: ApplicationVersion,
  devicePath: string,
  targetId: string | number,
}

type Result = void

const cmd: Command<Input, Result> = createCommand(
  'uninstallApp',
  ({ devicePath, targetId, ...app }) =>
    fromPromise(withDevice(devicePath)(transport => uninstallApp(transport, targetId, app))),
)

export default cmd
