// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'
import shouldFlashMcu from 'helpers/devices/shouldFlashMcu'

type Result = boolean

const cmd: Command<DeviceInfo, Result> = createCommand('shouldFlashMcu', data =>
  fromPromise(shouldFlashMcu(data)),
)

export default cmd
