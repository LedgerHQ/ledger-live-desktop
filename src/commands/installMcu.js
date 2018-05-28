// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

// import { withDevice } from 'helpers/deviceAccess'
import installMcu from 'helpers/firmware/installMcu'

// type Input = {
//   devicePath: string,
//   firmware: Object,
// }

// type Result = {
//   targetId: number | string,
//   version: string,
//   final: boolean,
//   mcu: boolean,
// }

type Input = *
type Result = *

const cmd: Command<Input, Result> = createCommand('devices', 'installMcu', () =>
  fromPromise(installMcu()),
)

export default cmd
