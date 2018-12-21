// @flow

import repair from '@ledgerhq/live-common/lib/hw/firmwareUpdate-repair'
import { createCommand, Command } from 'helpers/ipc'

type Input = void
type Result = { progress: number }

const cmd: Command<Input, Result> = createCommand(
  'firmwareRepair',
  () => repair(''), // devicePath='' HACK to not depend on a devicePath because it's dynamic
)

export default cmd
