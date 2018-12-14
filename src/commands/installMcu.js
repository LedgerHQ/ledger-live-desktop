// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'

import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import installMcu from 'helpers/firmware/installMcu'

type Input = {
  devicePath: string,
}

type Result = void

const cmd: Command<Input, Result> = createCommand('installMcu', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(installMcu(transport))),
)

export default cmd
