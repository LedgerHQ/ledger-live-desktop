// @flow

import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'

type Input = { password?: string }
type Result = void

const cmd: Command<Input, Result> = createCommand('libcoreInit', ({ password }) =>
  Observable.create(o => {
    const implementLibcore = require('@ledgerhq/live-common/lib/libcore/platforms/nodejs').default
    const logger = require('logger').default

    logger.log(`libcoreInit command received, password: ${password ? 'yes' : 'no'}`)

    implementLibcore({
      lib: require('@ledgerhq/ledger-core'),
      logger: (level, ...rest) => logger.libcore(level, ...rest),
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
      dbPassword: password,
    })

    o.complete()
    return () => {}
  }),
)

export default cmd
