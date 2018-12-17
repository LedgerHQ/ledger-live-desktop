// @flow

import checkId from '@ledgerhq/live-common/lib/hw/firmwareUpdate-checkId'
import type { OsuFirmware } from '@ledgerhq/live-common/lib/types/manager'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  devicePath: string,
  osuFirmware: OsuFirmware,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'firmwareCheckId',
  ({ devicePath, osuFirmware }) => checkId(devicePath, osuFirmware),
)

export default cmd
