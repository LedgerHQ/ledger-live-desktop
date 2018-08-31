// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import {
  checkCounterValues,
  checkManager,
  checkBlockchain,
  checkSecureWebsockets,
} from '../helpers/health'

type Input = void
type Result = void

const check = async () => {
  await checkCounterValues()
  await checkManager()
  await checkBlockchain()
  await checkSecureWebsockets()
}

const cmd: Command<Input, Result> = createCommand('healthCheck', () => fromPromise(check()))

export default cmd
