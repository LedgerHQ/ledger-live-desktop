// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'

import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import getMemInfo from 'helpers/devices/getMemInfo'

type Input = {
  devicePath: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('getMemInfo', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(getMemInfo(transport))),
)

export default cmd
