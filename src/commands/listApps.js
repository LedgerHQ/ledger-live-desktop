// @flow
import { createCommand, Command } from 'helpers/ipc'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import type { ApplicationVersion } from '@ledgerhq/live-common/lib/types/manager'
import { listApps } from '@ledgerhq/live-common/lib/apps/hw'
import type { AppOp, ListAppsEvent } from '@ledgerhq/live-common/lib/apps'

type Input = {
  devicePath: string,
  appOp: AppOp,
  targetId: string | number,
  app: ApplicationVersion,
}

const cmd: Command<Input, ListAppsEvent> = createCommand('listApps', ({ devicePath, deviceInfo }) =>
  withDevice(devicePath)(transport => listApps(transport, deviceInfo)),
)

export default cmd
