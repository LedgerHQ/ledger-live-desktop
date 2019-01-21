// @flow

import repair from '@ledgerhq/live-common/lib/hw/firmwareUpdate-repair'
import { createCommand, Command } from 'helpers/ipc'

type Input = {
  version: ?string,
}

type Result = { progress: number }

const cmd: Command<Input, Result> = createCommand(
  'firmwareRepair',
  ({ version }) => repair('', version), // devicePath='' HACK to not depend on a devicePath because it's dynamic
)

export default cmd
