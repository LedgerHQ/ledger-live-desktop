// @flow
import { createCommand, Command } from 'helpers/ipc'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import uninstallApp from '@ledgerhq/live-common/lib/hw/uninstallApp'
import type { ApplicationVersion } from '@ledgerhq/live-common/lib/types/manager'

type Input = {
  app: ApplicationVersion,
  devicePath: string,
  targetId: string | number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('uninstallApp', ({ devicePath, targetId, app }) =>
  withDevice(devicePath)(transport => uninstallApp(transport, targetId, app)),
)

export default cmd
