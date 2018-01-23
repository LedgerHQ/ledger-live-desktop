// @flow

import { app, ipcMain, BrowserWindow } from 'electron'

process.setMaxListeners(100)

// necessary to prevent win from being garbage collected
let mainWindow

function createMainWindow() {
  const windowOptions = {
    ...(process.platform === 'darwin'
      ? {
          frame: false,
          titleBarStyle: 'hiddenInset',
          vibrancy: 'ultra-dark', // https://github.com/electron/electron/issues/10521
        }
      : {}),
    show: false,
  }

  const window = new BrowserWindow(windowOptions)

  const url = __DEV__
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || ''}`
    : `file://${__dirname}/index.html`

  if (__DEV__) {
    window.webContents.openDevTools()
  }

  window.loadURL(url)

  window.on('close', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

const installExtensions = async () => {
  const installer = require('electron-devtools-installer') // eslint-disable-line
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log) // eslint-disable-line
}

app.on('ready', async () => {
  if (__DEV__) {
    await installExtensions()
  }

  mainWindow = createMainWindow()

  ipcMain.on('renderer-ready', () => mainWindow && mainWindow.show())
})
