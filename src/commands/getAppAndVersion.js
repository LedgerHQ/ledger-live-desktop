// @flow

import getAppAndVersion from '@ledgerhq/live-common/lib/hw/getAppAndVersion'
import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

type Input = {
  devicePath: string,
}

type Result = {
  name: string,
  version: string,
}

const cmd: Command<Input, Result> = createCommand('getAppAndVersion', ({ devicePath }) =>
  withDevice(devicePath)(transport =>
    from(getAppAndVersion(transport).then(({ name, version }) => ({ name, version }))),
  ),
)

export default cmd
