// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'

import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import installOsuFirmware from 'helpers/firmware/installOsuFirmware'

import type { Firmware } from 'components/modals/UpdateFirmware'

type Input = {
  devicePath: string,
  targetId: string | number,
  firmware: Firmware,
}

type Result = { success: boolean }

const cmd: Command<Input, Result> = createCommand(
  'installOsuFirmware',
  ({ devicePath, firmware, targetId }) =>
    withDevice(devicePath)(transport => from(installOsuFirmware(transport, targetId, firmware))),
)

export default cmd
