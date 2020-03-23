/* eslint-disable no-console */

const electron = require('electron')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

const delay = ms => new Promise(f => setTimeout(f, ms))

const MIN_TIME_DIFF = 1 * 1000 * 90 // 1.5 minute
const PING_INTERVAL = 1 * 1000 // 1 seconds

async function waitForSync() {
  let MAX_RETRIES = 100
  const userDataDirectory = electron.app.getPath('userData')
  const tmpAppJSONPath = path.resolve(userDataDirectory, 'app.json')
  const appJSONPath = tmpAppJSONPath.replace('/Electron/', '/Ledger Live/')

  function check() {
    const appJSONContent = fs.readFileSync(appJSONPath, 'utf-8')
    const appJSONParsed = JSON.parse(appJSONContent)
    const mapped = appJSONParsed.data.accounts.map(a => ({
      name: a.data.name,
      lastSyncDate: a.data.lastSyncDate,
    }))
    const now = Date.now()
    const areAllSync = mapped.every(account => {
      const diff = now - new Date(account.lastSyncDate).getTime()
      if (diff <= MIN_TIME_DIFF) return true
      console.log(
        `[${account.name}] synced ${moment(account.lastSyncDate).fromNow()} (${moment(
          account.lastSyncDate,
        ).format('YYYY-MM-DD HH:mm:ss')})`,
      )
      return false
    })
    return areAllSync
  }

  while (!check()) {
    MAX_RETRIES--
    if (!MAX_RETRIES) {
      console.log(`x Too much retries. Exitting.`)
      process.exit(1)
    }
    await delay(PING_INTERVAL)
  }

  process.exit(0)
}

waitForSync()
