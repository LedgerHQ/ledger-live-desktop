// @flow

import { shell, remote } from 'electron'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import killInternalProcess from 'commands/killInternalProcess'
import libcoreReset from 'commands/libcoreReset'

async function resetLibcore() {
  // we need to stop everything that is happening right now, like syncs
  await killInternalProcess
    .send()
    .toPromise()
    .catch(() => {}) // this is a normal error due to the crash of the process, we ignore it
  // we can now ask libcore to reset itself
  await libcoreReset.send().toPromise()
}

function reload() {
  require('electron')
    .remote.getCurrentWindow()
    .webContents.reload()
}

export async function hardReset() {
  disableDBMiddleware()
  db.resetAll()
  window.localStorage.clear()
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
