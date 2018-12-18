// @flow

import main from '@ledgerhq/live-common/lib/hw/firmwareUpdate-main'
import type { FinalFirmware } from '@ledgerhq/live-common/lib/types/manager'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  finalFirmware: FinalFirmware,
}

type Result = { progress: number, installing: ?string }

const cmd: Command<Input, Result> = createCommand(
  'firmwareMain',
  ({ finalFirmware }) => main('', finalFirmware),
  // devicePath='' HACK to not depend on a devicePath because it's dynamic
)

export default cmd
