// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo, OsuFirmware } from 'helpers/types'

import getLatestFirmwareForDevice from '../helpers/devices/getLatestFirmwareForDevice'

type Result = ?(OsuFirmware & { shouldFlashMcu: boolean })

const cmd: Command<DeviceInfo, Result> = createCommand('getLatestFirmwareForDevice', data =>
  fromPromise(getLatestFirmwareForDevice(data)),
)

export default cmd
