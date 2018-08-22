// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getCurrentFirmware from 'helpers/devices/getCurrentFirmware'

type Input = {
  deviceId: string | number,
  fullVersion: string,
  provider: number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('getCurrentFirmware', data =>
  fromPromise(getCurrentFirmware(data)),
)

export default cmd
