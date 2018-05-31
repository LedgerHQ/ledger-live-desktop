// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listApps from 'helpers/apps/listApps'

// type Input = {
//   targetId: string | number,
// }

type Input = *
type Result = *

const cmd: Command<Input, Result> = createCommand('listApps', () =>
  /* { targetId } */ fromPromise(listApps()),
)

export default cmd
