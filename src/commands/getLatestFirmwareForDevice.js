// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import getLatestFirmwareForDevice from '../helpers/devices/getLatestFirmwareForDevice'

type Result = *

const cmd: Command<DeviceInfo, Result> = createCommand('getLatestFirmwareForDevice', data =>
  fromPromise(getLatestFirmwareForDevice(data)),
)

export default cmd
