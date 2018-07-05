// @flow

import { app, globalShortcut, BrowserWindow, Menu, screen } from 'electron'
import debounce from 'lodash/debounce'
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
} from 'config/constants'

import menu from 'main/menu'
import db from 'helpers/db'

import { terminateAllTheThings } from './terminator'

const IS_MAC = process.platform === 'darwin'

const nestedWinParams = { isDarwinForceQuit: false }
let mainWindow

// make it a single instance by closing other instances
const shouldQuitBecauseAppIsAnotherInstance = app.makeSingleInstance(() => {
  // the callback: only called only for first instance
  // we want to show it, when the other starts to try another
  if (mainWindow) {
    showApp()

    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.focus()
  }
})

function showApp() {
  showOrFocus(mainWindow)
}

function quitAppNow() {
  app.isQuiting = true
  app.quit()
}

function showOrFocus(passedWin) {
  // default to main win
  const win = passedWin || mainWindow

  // sometimes when starting a second instance we get here although we don't want to
  if (!win) {
    return
  }

  if (win.isVisible()) {
    win.focus()
  } else {
    win.show()
  }

  // focus window afterwards always
  setTimeout(() => {
    win.focus()
  }, 60)
}

export const getMainWindow = () => mainWindow

// TODO put back OSX close behavior
// let forceClose = false

const { UPGRADE_EXTENSIONS, ELECTRON_WEBPACK_WDS_PORT, DEV_TOOLS, DEV_TOOLS_MODE } = process.env

const devTools = __DEV__ || DEV_TOOLS

const getWindowPosition = (height, width, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  }
}

const getDefaultUrl = () =>
  __DEV__ ? `http://localhost:${ELECTRON_WEBPACK_WDS_PORT || ''}` : `file://${__dirname}/index.html`

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
  const savedDimensions = db.getIn('settings', 'window.MainWindow.dimensions', {})
  const savedPositions = db.getIn('settings', 'window.MainWindow.positions', null)

  const width = savedDimensions.width || DEFAULT_WINDOW_WIDTH
  const height = savedDimensions.height || DEFAULT_WINDOW_HEIGHT

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
      mode: DEV_TOOLS_MODE,
    })
  }

  saveWindowSettings(window)

  window.loadURL(url)

  window.on('close', event => {
    // handle darwin
    if (IS_MAC) {
      if (!nestedWinParams.isDarwinForceQuit) {
        event.preventDefault()
        mainWindow.hide()
      }
    } else if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    } else {
      app.quit()
      terminateAllTheThings()
    }
  })

  window.on('ready-to-show', () => {
    window.show()
    setImmediate(() => {
      window.focus()
    })
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

if (shouldQuitBecauseAppIsAnotherInstance) {
  quitAppNow()
} else {
  app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open
    // until the user explicitly quits
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('before-quit', () => {
    // handle darwin
    if (IS_MAC) {
      nestedWinParams.isDarwinForceQuit = true
    }

    // un-register all shortcuts.
    globalShortcut.unregisterAll()
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createMainWindow()
    } else {
      showApp()
    }
  })

  const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!UPGRADE_EXTENSIONS
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
    mainWindow = createMainWindow()
  })
}
