// @flow
import { createCommand, Command } from 'helpers/ipc'
import installApp from '@ledgerhq/live-common/lib/hw/installApp'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import type { ApplicationVersion } from '@ledgerhq/live-common/lib/types/manager'

type Input = {
  devicePath: string,
  targetId: string | number,
  app: ApplicationVersion,
}

type Result = { progress: number }

const cmd: Command<Input, Result> = createCommand('installApp', ({ devicePath, targetId, app }) =>
  withDevice(devicePath)(transport => installApp(transport, targetId, app)),
)

export default cmd
