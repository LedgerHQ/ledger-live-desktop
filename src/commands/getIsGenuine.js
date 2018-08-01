// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo } from 'helpers/types'

import getIsGenuine from 'helpers/devices/getIsGenuine'
import { withDevice } from 'helpers/deviceAccess'

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
}
type Result = string

const cmd: Command<Input, Result> = createCommand('getIsGenuine', ({ devicePath, deviceInfo }) =>
  fromPromise(withDevice(devicePath)(transport => getIsGenuine(transport, deviceInfo))),
)

export default cmd
