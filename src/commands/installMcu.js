// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installMcu from 'helpers/firmware/installMcu'

type Input = {
  devicePath: string,
  targetId: string | number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('installMcu', ({ devicePath, targetId }) =>
  fromPromise(
    withDevice(devicePath)(transport => installMcu(transport, { targetId, version: '1.5' })),
  ),
)

export default cmd
