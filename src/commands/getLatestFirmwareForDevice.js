// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import type { DeviceInfo, FirmwareUpdateContext } from '@ledgerhq/live-common/lib/types/manager'
import manager from '@ledgerhq/live-common/lib/manager'

type Result = ?FirmwareUpdateContext

const cmd: Command<DeviceInfo, Result> = createCommand('getLatestFirmwareForDevice', deviceInfo =>
  from(manager.getLatestFirmwareForDevice(deviceInfo)),
)

export default cmd
