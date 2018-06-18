// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getIsGenuine from 'helpers/devices/getIsGenuine'
import { withDevice } from 'helpers/deviceAccess'

type Input = * // FIXME !
type Result = string

const cmd: Command<Input, Result> = createCommand('getIsGenuine', ({ devicePath, targetId }) =>
  fromPromise(withDevice(devicePath)(transport => getIsGenuine(transport, { targetId }))),
)

export default cmd
