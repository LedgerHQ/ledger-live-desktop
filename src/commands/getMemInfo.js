// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import getMemInfo from 'helpers/devices/getMemInfo'

type Input = {
  devicePath: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('devices', 'getMemInfo', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => getMemInfo(transport))),
)

export default cmd
