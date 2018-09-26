// @flow

import path from 'path'
import rimraf from 'rimraf'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import killInternalProcess from 'commands/killInternalProcess'

async function resetLibcoreDatabase() {
  await killInternalProcess.send().toPromise()
  const dbpath = path.resolve(resolveUserDataDirectory(), 'sqlite/')
  rimraf.sync(dbpath, { glob: false })
}

function reload() {
  require('electron')
    .remote.getCurrentWindow()
    .webContents.reload()
}

export async function hardReset() {
  disableDBMiddleware()
  db.resetAll()
  await delay(500)
  resetLibcoreDatabase()
  reload()
}

export async function softReset({ cleanAccountsCache }: *) {
  cleanAccountsCache()
  await delay(500)
  await db.cleanCache()
  resetLibcoreDatabase()
  reload()
}
