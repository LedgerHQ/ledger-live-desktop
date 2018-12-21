// @flow

// This is a test example for dev testing purpose.

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

type Input = {
  devicePath: string,
  apduHex: string,
}
type Result = {
  responseHex: string,
}

const cmd: Command<Input, Result> = createCommand('testApdu', ({ apduHex, devicePath }) =>
  withDevice(devicePath)(transport =>
    from(
      transport
        .exchange(Buffer.from(apduHex, 'hex'))
        .then(res => ({ responseHex: res.toString('hex') })),
    ),
  ),
)

export default cmd
