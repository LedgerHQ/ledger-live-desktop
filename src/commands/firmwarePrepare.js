// @flow

import prepare from '@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare'
import type { OsuFirmware } from '@ledgerhq/live-common/lib/types/manager'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  devicePath: string,
  osuFirmware: OsuFirmware,
}

type Result = { progress: number }

const cmd: Command<Input, Result> = createCommand(
  'firmwarePrepare',
  ({ devicePath, osuFirmware }) => prepare(devicePath, osuFirmware),
)

export default cmd
