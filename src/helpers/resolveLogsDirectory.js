// @flow

import fs from 'fs'
import path from 'path'

const resolveLogsDirectory = () => {
  const { LEDGER_LOGS_DIRECTORY } = process.env
  if (LEDGER_LOGS_DIRECTORY) return LEDGER_LOGS_DIRECTORY
  const electron = require('electron')
  return path.resolve((electron.app || electron.remote.app).getPath('userData'), 'logs')
}

export default resolveLogsDirectory

export const getCurrentLogFile = () =>
  new Promise((resolve, reject) => {
    const dir = resolveLogsDirectory()
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        // last file is always the most up to date log. file will rotate.
        const last = files[files.length - 1]
        if (!last) reject(new Error('no logs'))
        else resolve(path.resolve(dir, last))
      }
    })
  })
