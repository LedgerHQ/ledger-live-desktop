// @flow

import { app, BrowserWindow, Menu, ipcMain } from 'electron'

import menu from 'main/menu'

// necessary to prevent win from being garbage collected
let mainWindow
let preloadWindow

let forceClose = false

const devTools = __DEV__

const defaultWindowOptions = {
  backgroundColor: '#fff',
  center: true,
  webPreferences: {
    devTools,
  },
}

function createMainWindow() {
  const MIN_HEIGHT = 768
  const MIN_WIDTH = 1024

  const windowOptions = {
    ...defaultWindowOptions,
    ...(process.platform === 'darwin'
      ? {
          frame: false,
          titleBarStyle: 'hiddenInset',
        }
      : {}),
    height: MIN_HEIGHT,
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    show: false,
    width: MIN_WIDTH,
    webPreferences: {
      ...defaultWindowOptions.webPreferences,
      // Enable, among other things, the ResizeObserver
      experimentalFeatures: true,
    },
  }

  const window = new BrowserWindow(windowOptions)

  const url = __DEV__
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || ''}`
    : `file://${__dirname}/index.html`

  if (devTools) {
    window.webContents.openDevTools()
  }

  window.loadURL(url)

  window.on('close', e => {
    if (!forceClose) {
      e.preventDefault()

      if (mainWindow !== null) {
        mainWindow.hide()
      }
    }
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

function createPreloadWindow() {
  // Preload renderer of main windows
  mainWindow = createMainWindow()

  const HEIGHT = 144
  const WIDTH = 256

  const windowOptions = {
    ...defaultWindowOptions,
    closable: false,
    frame: false,
    fullscreenable: false,
    height: HEIGHT,
    resizable: false,
    show: false,
    skipTaskbar: true,
    width: WIDTH,
  }

  const window = new BrowserWindow(windowOptions)

  window.loadURL(`file://${__static}/preload-window.html`)

  window.on('ready-to-show', () => {
    window.show()
  })

  return window
}

app.on('before-quit', () => {
  forceClose = true
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null && preloadWindow === null) {
    preloadWindow = createPreloadWindow()
  } else if (mainWindow !== null) {
    mainWindow.show()
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

app.setAsDefaultProtocolClient('ledgerhq')

app.on('ready', async () => {
  if (__DEV__) {
    await installExtensions()
  }

  Menu.setApplicationMenu(menu)

  preloadWindow = createPreloadWindow()
})

ipcMain.on('app-finish-rendering', () => {
  if (preloadWindow !== null) {
    preloadWindow.destroy()
    preloadWindow = null
  }

  if (mainWindow !== null) {
    mainWindow.show()
    setImmediate(() => mainWindow !== null && mainWindow.focus())
  }
})
