// @flow

import path from 'path'
import rimraf from 'rimraf'
import resolveUserDataDirectory from './resolveUserDataDirectory'

export const resolveLogsDirectory = () => {
  const { LEDGER_LOGS_DIRECTORY } = process.env
  if (LEDGER_LOGS_DIRECTORY) return LEDGER_LOGS_DIRECTORY
  const electron = require('electron')
  return path.resolve((electron.app || electron.remote.app).getPath('userData'), 'logs')
}

export const cleanUpBeforeClosingSync = () => {
  rimraf.sync(resolveLogsDirectory(), { disableGlob: true })
  rimraf.sync(path.resolve(resolveUserDataDirectory(), 'sqlite/*.log'))
}
