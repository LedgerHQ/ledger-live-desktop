// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getLatestFirmwareForDevice from '../helpers/devices/getLatestFirmwareForDevice'

type Input = {
  targetId: string | number,
  version: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('getLatestFirmwareForDevice', data =>
  fromPromise(getLatestFirmwareForDevice(data)),
)

export default cmd
