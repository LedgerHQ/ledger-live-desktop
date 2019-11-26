// @flow
import { createCommand, Command } from 'helpers/ipc'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'
import { listApps } from '@ledgerhq/live-common/lib/apps/hw'
import type { ListAppsEvent } from '@ledgerhq/live-common/lib/apps'

type Input = {
  deviceInfo: DeviceInfo,
  devicePath: string,
}

const cmd: Command<Input, ListAppsEvent> = createCommand('listApps', ({ devicePath, deviceInfo }) =>
  withDevice(devicePath)(transport => listApps(transport, deviceInfo)),
)

export default cmd
