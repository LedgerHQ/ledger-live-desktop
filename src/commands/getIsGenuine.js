// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getIsGenuine from 'helpers/devices/getIsGenuine'
import { withDevice } from 'helpers/deviceAccess'

type Input = {
  devicePath: string,
  targetId: string | number,
  version: string,
}
type Result = string

const cmd: Command<Input, Result> = createCommand(
  'getIsGenuine',
  ({ devicePath, targetId, version }) =>
    fromPromise(
      withDevice(devicePath)(transport => getIsGenuine(transport, { targetId, version })),
    ),
)

export default cmd
