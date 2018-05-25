// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getFirmwareInfo from 'helpers/devices/getFirmwareInfo'

type Input = {
  targetId: string | number,
  version: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('devices', 'getFirmwareInfo', data =>
  fromPromise(getFirmwareInfo(data)),
)

export default cmd
