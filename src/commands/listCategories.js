// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listCategories from 'helpers/apps/listCategories'

type Input = {}

type Result = *

const cmd: Command<Input, Result> = createCommand('listCategories', () =>
  fromPromise(listCategories()),
)

export default cmd
