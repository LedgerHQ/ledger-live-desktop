// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installApp from 'helpers/apps/installApp'

import type { ApplicationVersion } from 'helpers/types'

type Input = {
  app: ApplicationVersion,
  devicePath: string,
  targetId: string | number,
}

type Result = void

const cmd: Command<Input, Result> = createCommand(
  'installApp',
  ({ devicePath, targetId, ...app }) =>
    fromPromise(withDevice(devicePath)(transport => installApp(transport, targetId, app))),
)

export default cmd
