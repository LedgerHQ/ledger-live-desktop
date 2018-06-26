// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import installFinalFirmware from 'helpers/firmware/installFinalFirmware'

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
}

type Result = {
  success: boolean,
}

const cmd: Command<Input, Result> = createCommand(
  'installFinalFirmware',
  ({ devicePath, deviceInfo }) =>
    fromPromise(withDevice(devicePath)(transport => installFinalFirmware(transport, deviceInfo))),
)

export default cmd
