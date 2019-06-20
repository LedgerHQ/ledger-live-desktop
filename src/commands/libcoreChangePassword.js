// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'

import { createCommand, Command } from 'helpers/ipc'
import { withLibcore } from '@ledgerhq/live-common/lib/libcore/access'

type Input = {
  oldPassword: string,
  newPassword: string,
}
type Result = void

const cmd: Command<Input, Result> = createCommand(
  'libcoreChangePassword',
  ({ oldPassword, newPassword }) =>
    fromPromise(
      withLibcore(async core => core.getPoolInstance().changePassword(oldPassword, newPassword)),
    ),
)

export default cmd
