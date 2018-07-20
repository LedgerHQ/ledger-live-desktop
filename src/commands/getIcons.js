// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import getIcons from 'helpers/apps/getIcons'

type Icon = {
  id: number,
  name: string,
  file: string,
}

type Input = *

type Result = Array<Icon>

const cmd: Command<Input, Result> = createCommand('getIcons', () => fromPromise(getIcons()))

export default cmd
