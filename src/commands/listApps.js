// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listApps from 'helpers/apps/listApps'

type Input = {}

type Result = *

const cmd: Command<Input, Result> = createCommand('listApps', () => fromPromise(listApps()))

export default cmd
