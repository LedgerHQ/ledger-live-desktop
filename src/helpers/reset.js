// @flow

import fs from 'fs'
import { shell, remote } from 'electron'
import path from 'path'
import rimraf from 'rimraf'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import killInternalProcess from 'commands/killInternalProcess'
import { DBNotReset } from '@ledgerhq/errors'

async function resetLibcoreDatabase() {
  await killInternalProcess.send().toPromise()
  const dbpath = path.resolve(resolveUserDataDirectory(), 'sqlite/')
  rimraf.sync(dbpath, { glob: false })
  if (fs.existsSync(dbpath)) {
    throw new DBNotReset()
  }
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
  await resetLibcoreDatabase()
  reload()
}

export async function softReset({ cleanAccountsCache }: *) {
  cleanAccountsCache()
  await delay(500)
  await db.cleanCache()
  await resetLibcoreDatabase()
  reload()
}

export async function openUserDataFolderAndQuit() {
  shell.openItem(resolveUserDataDirectory())
  remote.app.quit()
}
