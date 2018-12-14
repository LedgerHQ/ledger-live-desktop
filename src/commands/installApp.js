// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'

import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
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
    withDevice(devicePath)(transport => from(installApp(transport, targetId, app))),
)

export default cmd
