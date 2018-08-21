// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listApps from 'helpers/apps/listApps'
import type { Application } from 'helpers/types'

type Input = void

type Result = Array<Application>

const cmd: Command<Input, Result> = createCommand('listApps', () => fromPromise(listApps()))

export default cmd
