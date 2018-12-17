// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import getDeviceInfo from '@ledgerhq/live-common/lib/hw/getDeviceInfo'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'

type Input = {
  devicePath: string,
}

type Result = DeviceInfo

const cmd: Command<Input, Result> = createCommand('getDeviceInfo', ({ devicePath }) =>
  withDevice(devicePath)(transport => from(getDeviceInfo(transport))),
)

export default cmd
