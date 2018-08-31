// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import shouldFlashMcu from 'helpers/devices/shouldFlashMcu'

import type { DeviceInfo } from 'helpers/types'

type Result = boolean

const cmd: Command<DeviceInfo, Result> = createCommand('shouldFlashMcu', data =>
  fromPromise(shouldFlashMcu(data)),
)

export default cmd
