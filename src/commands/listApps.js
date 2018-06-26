// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listApps from 'helpers/apps/listApps'

type Input = {
  targetId: string | number,
  fullVersion: string,
  provider: number,
}

type Result = *

const cmd: Command<Input, Result> = createCommand(
  'listApps',
  ({ targetId, fullVersion, provider }) => fromPromise(listApps(targetId, fullVersion, provider)),
)

export default cmd
