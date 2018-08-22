// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import getDeviceInfo from 'helpers/devices/getDeviceInfo'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

type Input = {
  devicePath: string,
}

const cmd: Command<Input, DeviceInfo> = createCommand('getDeviceInfo', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => getDeviceInfo(transport))),
)

export default cmd
