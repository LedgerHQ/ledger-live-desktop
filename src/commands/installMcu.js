// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import installMcu from 'helpers/firmware/installMcu'

type Input = {
  devicePath: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('installMcu', ({ devicePath }) =>
  fromPromise(withDevice(devicePath)(transport => installMcu(transport))),
)

export default cmd
