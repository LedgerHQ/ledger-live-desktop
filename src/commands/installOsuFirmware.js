// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installOsuFirmware from 'helpers/firmware/installOsuFirmware'

type Input = {
  devicePath: string,
  firmware: Object,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'installOsuFirmware',
  ({ devicePath, firmware }) =>
    fromPromise(withDevice(devicePath)(transport => installOsuFirmware(transport, firmware))),
)

export default cmd
