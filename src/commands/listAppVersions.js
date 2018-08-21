// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import type { DeviceInfo, ApplicationVersion } from 'helpers/types'

import listAppVersions from 'helpers/apps/listAppVersions'

type Result = Array<ApplicationVersion>

const cmd: Command<DeviceInfo, Result> = createCommand('listAppVersions', deviceInfo =>
  fromPromise(listAppVersions(deviceInfo)),
)

export default cmd
