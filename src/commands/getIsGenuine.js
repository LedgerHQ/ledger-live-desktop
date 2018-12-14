// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import type { DeviceInfo } from 'helpers/types'

import getIsGenuine from 'helpers/devices/getIsGenuine'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
}
type Result = string

const cmd: Command<Input, Result> = createCommand('getIsGenuine', ({ devicePath, deviceInfo }) =>
  withDevice(devicePath)(transport => from(getIsGenuine(transport, deviceInfo))),
)

export default cmd
