// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import listAppVersions from 'helpers/apps/listAppVersions'

type Result = *

const cmd: Command<DeviceInfo, Result> = createCommand('listAppVersions', deviceInfo =>
  fromPromise(listAppVersions(deviceInfo)),
)

export default cmd
