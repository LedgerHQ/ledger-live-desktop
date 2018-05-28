// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import listApps from 'helpers/apps/listApps'

type Input = {
  devicePath: string,
}
type Result = *

const cmd: Command<Input, Result> = createCommand('devices', 'listApps', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => listApps(transport))),
)

export default cmd
