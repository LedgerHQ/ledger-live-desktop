// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listApps from 'helpers/apps/listApps'

type Input = {
  targetId: string | number,
  version: string,
}

type Result = *

const cmd: Command<Input, Result> = createCommand('listApps', ({ targetId, version }) =>
  fromPromise(listApps(targetId, version)),
)

export default cmd
