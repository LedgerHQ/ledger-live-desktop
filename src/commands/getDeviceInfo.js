// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import type { DeviceInfo } from 'helpers/types'

type Input = {
  devicePath: string,
}

type Result = DeviceInfo

const cmd: Command<Input, Result> = createCommand('getDeviceInfo', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => getDeviceInfo(transport))),
)

export default cmd
