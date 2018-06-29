// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installOsuFirmware from 'helpers/firmware/installOsuFirmware'

import type { Firmware } from 'components/modals/UpdateFirmware'

type Input = {
  devicePath: string,
  targetId: string | number,
  firmware: Firmware,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'installOsuFirmware',
  ({ devicePath, firmware, targetId }) =>
    fromPromise(
      withDevice(devicePath)(transport => installOsuFirmware(transport, targetId, firmware)),
    ),
)

export default cmd
