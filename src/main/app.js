// @flow

import { app, BrowserWindow, Menu, ipcMain, screen } from 'electron'
import debounce from 'lodash/debounce'

import menu from 'main/menu'
import db from 'helpers/db'

// necessary to prevent win from being garbage collected
let mainWindow
let preloadWindow

let forceClose = false

const devTools = __DEV__

const getWindowPosition = (height, width) => {
  const { bounds } = screen.getPrimaryDisplay()

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  }
}

const defaultWindowOptions = {
  backgroundColor: '#fff',
  webPreferences: {
    devTools,
  },
}

function createMainWindow() {
  const MIN_HEIGHT = 768
  const MIN_WIDTH = 1024

  const savedDimensions = db.getIn('settings', 'window.dimensions', {})
  const savedPositions = db.getIn('settings', 'window.positions', null)

  const width = savedDimensions.width || MIN_WIDTH
  const height = savedDimensions.height || MIN_HEIGHT

  const windowOptions = {
    ...defaultWindowOptions,
    ...(savedPositions !== null ? savedPositions : getWindowPosition(height, width)),
    ...(process.platform === 'darwin'
      ? {
          frame: false,
          titleBarStyle: 'hiddenInset',
        }
      : {}),
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
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

  window.on(
    'resize',
    debounce(() => {
      const [width, height] = window.getSize()
      db.setIn('settings', 'window.dimensions', { width, height })
    }, 100),
  )

  window.on(
    'move',
    debounce(() => {
      const [x, y] = window.getPosition()
      db.setIn('settings', 'window.positions', { x, y })
    }, 100),
  )

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

  const height = 144
  const width = 256

  const windowOptions = {
    ...defaultWindowOptions,
    ...getWindowPosition(height, width),
    closable: false,
    frame: false,
    fullscreenable: false,
    height,
    resizable: false,
    show: false,
    skipTaskbar: true,
    width,
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

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }

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
