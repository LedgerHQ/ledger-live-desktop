// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import getDeviceInfo from 'helpers/devices/getDeviceInfo'

type Input = {
  devicePath: string,
}

type Result = {
  targetId: number | string,
  version: string,
  final: boolean,
  mcu: boolean,
}

const cmd: Command<Input, Result> = createCommand('getDeviceInfo', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => getDeviceInfo(transport))),
)

export default cmd
