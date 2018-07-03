// @flow

import path from 'path'
import moment from 'moment'

const resolveLogsDirectory = () => {
  const { LEDGER_LOGS_DIRECTORY } = process.env
  if (LEDGER_LOGS_DIRECTORY) return LEDGER_LOGS_DIRECTORY
  const electron = require('electron')
  return path.resolve((electron.app || electron.remote.app).getPath('userData'), 'logs')
}

export default resolveLogsDirectory

export const RotatingLogFileParameters = {
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
}

export const getCurrentLogFile = () =>
  path.resolve(
    resolveLogsDirectory(),
    RotatingLogFileParameters.filename.replace(
      '%DATE%',
      moment().format(RotatingLogFileParameters.datePattern),
    ),
  )
