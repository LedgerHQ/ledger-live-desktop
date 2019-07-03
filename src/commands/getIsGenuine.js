// @flow

import { createCommand, Command } from 'helpers/ipc'
import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import checkDeviceForManager from '@ledgerhq/live-common/lib/hw/checkDeviceForManager'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import type { DeviceInfo, GenuineCheckEvent } from '@ledgerhq/live-common/lib/types/manager'
import { SKIP_GENUINE } from 'config/constants'

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
}
type Result = GenuineCheckEvent

const cmd: Command<Input, Result> = createCommand('getIsGenuine', ({ devicePath, deviceInfo }) =>
  withDevice(devicePath)(transport =>
    SKIP_GENUINE
      ? of({ type: 'result', payload: '0000' }).pipe(delay(1000))
      : checkDeviceForManager(transport, deviceInfo),
  ),
)

export default cmd
