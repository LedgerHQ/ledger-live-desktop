// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getCurrentFirmware from 'helpers/devices/getCurrentFirmware'
import type { FinalFirmware } from 'helpers/types'

type Input = {
  deviceId: string | number,
  fullVersion: string,
  provider: number,
}

type Result = FinalFirmware

const cmd: Command<Input, Result> = createCommand('getCurrentFirmware', data =>
  fromPromise(getCurrentFirmware(data)),
)

export default cmd
