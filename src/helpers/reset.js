// @flow

import path from 'path'
import rimraf from 'rimraf'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'

function resetLibcoreDatabase() {
  const dbpath = path.resolve(resolveUserDataDirectory(), 'sqlite/')
  rimraf.sync(dbpath, { glob: false })
}

function reload() {
  require('electron')
    .remote.getCurrentWindow()
    .webContents.reload()
}

export async function hardReset() {
  resetLibcoreDatabase()
  disableDBMiddleware()
  db.resetAll()
  await delay(500)
  reload()
}

export async function softReset({ cleanAccountsCache }: *) {
  resetLibcoreDatabase()
  cleanAccountsCache()
  await delay(500)
  db.cleanCache()
  reload()
}
