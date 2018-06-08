// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import isDashboardOpen from '../helpers/devices/isDashboardOpen'

type Input = {
  devicePath: string,
}

type Result = boolean

const cmd: Command<Input, Result> = createCommand('isDashboardOpen', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => isDashboardOpen(transport))),
)

export default cmd
