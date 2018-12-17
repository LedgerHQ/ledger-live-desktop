// @flow

import { createCommand, Command } from 'helpers/ipc'
import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import genuineCheck from '@ledgerhq/live-common/lib/hw/genuineCheck'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'
import { SKIP_GENUINE } from 'config/constants'

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
}
type Result = string

const cmd: Command<Input, Result> = createCommand('getIsGenuine', ({ devicePath, deviceInfo }) =>
  withDevice(devicePath)(
    transport =>
      SKIP_GENUINE ? of('0000').pipe(delay(1000)) : genuineCheck(transport, deviceInfo),
  ),
)

export default cmd
