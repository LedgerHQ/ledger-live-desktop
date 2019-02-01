// @flow

import { shell, remote } from 'electron'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import killInternalProcess from 'commands/killInternalProcess'
import withLibcore from 'helpers/withLibcore'

async function resetLibcore() {
  await killInternalProcess.send().toPromise()
  withLibcore(core => core.freshResetAll())
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
  await resetLibcore()
  reload()
}

export async function softReset({ cleanAccountsCache }: *) {
  cleanAccountsCache()
  await delay(500)
  await db.cleanCache()
  await resetLibcore()
  reload()
}

export async function openUserDataFolderAndQuit() {
  shell.openItem(resolveUserDataDirectory())
  remote.app.quit()
}
