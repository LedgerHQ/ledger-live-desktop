// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import listCategories from 'helpers/apps/listCategories'
import type { Category } from 'helpers/types'

type Input = void

type Result = Array<Category>

const cmd: Command<Input, Result> = createCommand('listCategories', () =>
  fromPromise(listCategories()),
)

export default cmd
