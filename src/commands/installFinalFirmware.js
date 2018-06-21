// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

import installFinalFirmware from 'helpers/firmware/installFinalFirmware'

type Input = {
  devicePath: string,
  targetId: string | number,
  version: string,
}

type Result = {
  success: boolean,
}

const cmd: Command<Input, Result> = createCommand(
  'installFinalFirmware',
  ({ devicePath, ...rest }) =>
    fromPromise(withDevice(devicePath)(transport => installFinalFirmware(transport, { ...rest }))),
)

export default cmd
