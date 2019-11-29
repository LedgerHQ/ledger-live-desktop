// @flow

import { log } from '@ledgerhq/logs'
import { ipcRenderer, shell, remote } from 'electron'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import { disable as disableDBMiddleware } from 'middlewares/db'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import libcoreReset from 'commands/libcoreReset'
import { clearBridgeCache } from 'bridge/cache'

async function killInternalProcess() {
  ipcRenderer.send('clean-processes')
  return delay(1000)
}

async function resetLibcore() {
  log('clear-cache', 'resetLibcore...')
  // we need to stop everything that is happening right now, like syncs
  await killInternalProcess()
  log('clear-cache', 'killed.')
  // we can now ask libcore to reset itself
  await libcoreReset.send().toPromise()
  log('clear-cache', 'reset.')
}

function reload() {
  require('electron')
    .remote.getCurrentWindow()
    .webContents.reload()
}

export async function hardReset() {
  log('clear-cache', 'clearBridgeCache()')
  clearBridgeCache()
  log('clear-cache', 'hardReset()')
  disableDBMiddleware()
  db.resetAll()
  window.localStorage.clear()
  await delay(500)
  await resetLibcore()
  log('clear-cache', 'reload()')
  reload()
}

export async function softReset({ cleanAccountsCache }: *) {
  log('clear-cache', 'clearBridgeCache()')
  clearBridgeCache()
  log('clear-cache', 'cleanAccountsCache()')
  cleanAccountsCache()
  await delay(500)
  log('clear-cache', 'db.cleanCache()')
  await db.cleanCache()
  await resetLibcore()
  log('clear-cache', 'reload()')
  reload()
}

export async function openUserDataFolderAndQuit() {
  shell.openItem(resolveUserDataDirectory())
  remote.app.quit()
}
