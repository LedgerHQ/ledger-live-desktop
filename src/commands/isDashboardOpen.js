// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

import isDashboardOpen from '../helpers/devices/isDashboardOpen'

type Input = {
  devicePath: string,
}

type Result = boolean

const cmd: Command<Input, Result> = createCommand('isDashboardOpen', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(isDashboardOpen(transport))),
)

export default cmd
