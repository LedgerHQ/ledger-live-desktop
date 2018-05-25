// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getIsGenuine from 'helpers/devices/getIsGenuine'

type Input = *
type Result = boolean

const cmd: Command<Input, Result> = createCommand('devices', 'getIsGenuine', () =>
  fromPromise(getIsGenuine()),
)

export default cmd
