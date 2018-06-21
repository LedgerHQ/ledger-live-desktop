import libcoreHardReset from 'commands/libcoreHardReset'
import { disable as disableDBMiddleware } from 'middlewares/db'

import db from 'helpers/db'
import { delay } from 'helpers/promise'

export default async function hardReset() {
  await libcoreHardReset.send()
  disableDBMiddleware()
  db.resetAll()
  await delay(500)
}
