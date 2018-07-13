// @flow

import path from 'path'

const resolveLogsDirectory = () => {
  const { LEDGER_LOGS_DIRECTORY } = process.env
  if (LEDGER_LOGS_DIRECTORY) return LEDGER_LOGS_DIRECTORY
  const electron = require('electron')
  return path.resolve((electron.app || electron.remote.app).getPath('userData'), 'logs')
}

export default resolveLogsDirectory
