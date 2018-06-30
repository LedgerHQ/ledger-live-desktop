// @flow

// This is a test example for dev testing purpose.

import { Observable } from 'rxjs'
import { createCommand, Command } from 'helpers/ipc'

const cmd: Command<void, string> = createCommand('ping', () =>
  Observable.create(o => {
    o.next('pong')
    o.complete()
  }),
)

export default cmd
