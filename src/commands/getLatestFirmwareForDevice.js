// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import type {
  DeviceInfo,
  OsuFirmware,
  FinalFirmware,
} from '@ledgerhq/live-common/lib/types/manager'
import manager from '@ledgerhq/live-common/lib/manager'

type Result = ?{ osu: OsuFirmware, final: FinalFirmware }

const cmd: Command<DeviceInfo, Result> = createCommand('getLatestFirmwareForDevice', deviceInfo =>
  from(manager.getLatestFirmwareForDevice(deviceInfo)),
)

export default cmd
