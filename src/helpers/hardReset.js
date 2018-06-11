import libcoreHardReset from 'commands/libcoreHardReset'
import { disable as disableDBMiddleware } from 'middlewares/db'

import db from 'helpers/db'
import { delay } from 'helpers/promise'

export default async function hardReset() {
  // TODO: wait for the libcoreHardReset to be finished
  // actually, libcore doesnt goes back to js thread
  await Promise.race([libcoreHardReset.send().toPromise(), delay(500)])
  disableDBMiddleware()
  db.resetAll()
  await delay(500)
}
