// @flow
import { ipcRenderer } from 'electron'
import logger from 'logger'

import libcoreChangePasswordCmd from 'commands/libcoreChangePassword'
import libcoreGetPoolNameCmd from 'commands/libcoreGetPoolName'
import libcoreGetVersionCmd from 'commands/libcoreGetVersion'
import killInternalProcess from 'commands/killInternalProcess'

import { retry } from './promise'

export const waitForLibcore = async () => {
  // Tries sending the lightest query (getVersion) to libcore until it gets a response
  // Also getVersion works even if the db password is wrong
  await retry(async () => libcoreGetVersionCmd.send().toPromise())
}

export const reloadLibcore = async () => {
  logger.log('reloadLibcore')
  await killInternalProcess
    .send()
    .toPromise()
    .catch(() => {}) // this is a normal error due to the crash of the process, we ignore it
  await waitForLibcore()
}

export const isUnlocked = async () => {
  try {
    // Libcore is running fine with a wrong db password until it tries to access said db.
    // As even an empty Ledger Live has a pool saved in the libcore db, let's try to get its name:
    // the query will fail if it can't open the db (because its encrypted)
    await libcoreGetPoolNameCmd.send().toPromise()
    return true
  } catch (e) {
    return false
  }
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  await libcoreChangePasswordCmd.send({ oldPassword, newPassword }).toPromise()
}

export const setPassword = async (password: string) => {
  ipcRenderer.send('setLibcorePassword', password)
  await waitForLibcore()
}
