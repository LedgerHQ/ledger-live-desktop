// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withLibcore } from '@ledgerhq/live-common/lib/libcore/access'

type Input = {
  oldPassword: string,
  newPassword: string,
}
type Result = void

const cmd: Command<Input, Result> = createCommand(
  'libcoreChangePassword',
  ({ oldPassword, newPassword }) =>
    from(
      withLibcore(async core => core.getPoolInstance().changePassword(oldPassword, newPassword)),
    ),
)

export default cmd
