// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

import installFinalFirmware from 'helpers/firmware/installFinalFirmware'

type Input = {
  devicePath: string,
}

type Result = {
  success: boolean,
}

const cmd: Command<Input, Result> = createCommand('installFinalFirmware', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(installFinalFirmware(transport))),
)

export default cmd
