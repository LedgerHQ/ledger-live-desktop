// @flow

import prepare from '@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare'
import type { FirmwareUpdateContext } from '@ledgerhq/live-common/lib/types/manager'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  devicePath: string,
  firmware: FirmwareUpdateContext,
}

type Result = { progress: number, displayedOnDevice: boolean }

const cmd: Command<Input, Result> = createCommand('firmwarePrepare', ({ devicePath, firmware }) =>
  prepare(devicePath, firmware),
)

export default cmd
