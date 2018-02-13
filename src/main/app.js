// @flow

import { app, BrowserWindow, Menu, ipcMain, screen } from 'electron'
import debounce from 'lodash/debounce'

import menu from 'main/menu'
import db from 'helpers/db'

// necessary to prevent win from being garbage collected
let mainWindow = null
let devWindow = null
let preloadWindow = null

let forceClose = false

const devTools = __DEV__

const getWindowPosition = (height, width, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  }
}

const handleCloseWindow = w => e => {
  if (!forceClose) {
    e.preventDefault()

    if (w !== null) {
      w.hide()
    }
  }
}

const getDefaultUrl = () =>
  __DEV__
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT || ''}`
    : `file://${__dirname}/index.html`

const saveWindowSettings = window => {
  window.on(
    'resize',
    debounce(() => {
      const [width, height] = window.getSize()
      db.setIn('settings', `window.${window.name}.dimensions`, { width, height })
    }, 100),
  )

  window.on(
    'move',
    debounce(() => {
      const [x, y] = window.getPosition()
      db.setIn('settings', `window.${window.name}.positions`, { x, y })
    }, 100),
  )
}

const defaultWindowOptions = {
  backgroundColor: '#fff',
  webPreferences: {
    devTools,
    // Enable, among other things, the ResizeObserver
    experimentalFeatures: true,
  },
}

function createMainWindow() {
  const MIN_HEIGHT = 768
  const MIN_WIDTH = 1024

  const savedDimensions = db.getIn('settings', 'window.MainWindow.dimensions', {})
  const savedPositions = db.getIn('settings', 'window.MainWindow.positions', null)

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
    autoHideMenuBar: true,
    height,
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    show: false,
    width,
  }

  const window = new BrowserWindow(windowOptions)

  window.name = 'MainWindow'

  const url = getDefaultUrl()

  if (devTools) {
    window.webContents.openDevTools({
      mode: process.env.DEV_TOOLS_MODE,
    })
  }

  saveWindowSettings(window)

  window.loadURL(url)

  window.on('close', handleCloseWindow(window))

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

function createDevWindow() {
  const MIN_HEIGHT = 500
  const MIN_WIDTH = 360

  const savedPositions = db.getIn('settings', 'window.DevWindow.positions', null)

  const width = MIN_WIDTH
  const height = MIN_HEIGHT

  const windowOptions = {
    ...defaultWindowOptions,
    ...(savedPositions !== null ? savedPositions : {}),
    fullscreenable: false,
    resizable: false,
    height,
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    show: false,
    skipTaskbar: true,
    title: 'Dev Tools',
    width,
  }

  const window = new BrowserWindow(windowOptions)

  window.name = 'DevWindow'

  const url = getDefaultUrl()

  saveWindowSettings(window)

  window.loadURL(`${url}/#/dev`)
  window.setMenu(null)

  window.on('close', handleCloseWindow(window))

  window.on('ready-to-show', () => {
    window.show()
  })

  // Don't want to use HTML <title>
  window.on('page-title-updated', e => e.preventDefault())

  return window
}

function createPreloadWindow() {
  // Preload renderer of main windows
  mainWindow = createMainWindow()

  const [x, y] = mainWindow.getPosition()

  if (__DEV__) {
    devWindow = createDevWindow()
  }

  const height = 144
  const width = 256

  const windowOptions = {
    ...defaultWindowOptions,
    ...getWindowPosition(height, width, screen.getDisplayNearestPoint({ x, y })),
    alwaysOnTop: true,
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

  window.name = 'PreloadWindow'

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

ipcMain.once('app-finish-rendering', () => {
  if (preloadWindow !== null) {
    preloadWindow.destroy()
    preloadWindow = null
  }

  if (mainWindow !== null) {
    mainWindow.show()
    setImmediate(() => mainWindow !== null && mainWindow.focus())
  }

  if (__DEV__ && devWindow !== null) {
    devWindow.show()
  }
})
