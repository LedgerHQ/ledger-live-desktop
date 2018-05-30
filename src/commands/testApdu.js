// @flow

// This is a test example for dev testing purpose.

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'

type Input = {
  devicePath: string,
  apduHex: string,
}
type Result = {
  responseHex: string,
}

const cmd: Command<Input, Result> = createCommand('testApdu', ({ apduHex, devicePath }) =>
  fromPromise(
    withDevice(devicePath)(async transport => {
      const res = await transport.exchange(Buffer.from(apduHex, 'hex'))
      return { responseHex: res.toString('hex') }
    }),
  ),
)

export default cmd
