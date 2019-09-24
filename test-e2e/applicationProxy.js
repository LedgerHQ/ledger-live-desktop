import { Application } from 'spectron'

const os = require('os')
const appVersion = require('../package.json')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

export function getConfigPath() {
  const platform = os.platform()
  let userDataPath
  if (platform === 'darwin') {
    userDataPath = `${os.homedir()}/Library/Application Support/Ledger Live`
  } else if (platform === 'win32') {
    userDataPath = '%AppData\\Roaming\\Ledger Live'
  } else {
    userDataPath = '.config/Ledger live'
  }
  return userDataPath
}

function getAppPath() {
  const platform = os.platform()
  let appPath
  if (platform === 'darwin') {
    appPath = './dist/mac/Ledger Live.app/Contents/MacOS/Ledger Live'
  } else if (platform === 'win32') {
    appPath = '.\\dist\\win-unpacked\\Ledger Live.exe'
  } else {
    appPath = `./dist/ledger-live-desktop-${appVersion.version}-linux-x86_64.AppImage`
  }
  return appPath
}

export function applicationProxy(userData = null, envVar = {}) {
  const configPath = getConfigPath()
  if (fs.existsSync(configPath)) {
    rimraf.sync(configPath)
    fs.mkdirSync(configPath)
  }
  if (userData != null) {
    const jsonFile = path.resolve('test-e2e/data/', userData)
    fs.copyFileSync(jsonFile, `${configPath}/app.json`)
  }
  const app = new Application({
    path: getAppPath(),
    env: envVar,
  })
  return app
}
