// @flow

import 'helpers/live-common-setup'

import { app, BrowserWindow, Menu, screen } from 'electron'
import debounce from 'lodash/debounce'
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
} from 'config/constants'

import menu from 'main/menu'
import db from 'helpers/db'
import { i } from 'helpers/staticPath'
import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'

import { terminateAllTheThings } from './terminator'

// necessary to prevent win from being garbage collected
let mainWindow = null

db.init(resolveUserDataDirectory())

const isSecondInstance = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

export const getMainWindow = () => mainWindow

const { UPGRADE_EXTENSIONS, ELECTRON_WEBPACK_WDS_PORT, DEV_TOOLS, DEV_TOOLS_MODE } = process.env

const devTools = __DEV__ || DEV_TOOLS

// context menu - see #978
require('electron-context-menu')({
  showInspectElement: __DEV__ || DEV_TOOLS,
  showCopyImageAddress: false,
  // TODO: i18n for labels
  labels: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    copyLink: 'Copy Link',
    inspect: 'Inspect element',
  },
})

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
  const windowParamsHandler = () => {
    const [width, height] = window.getSize()
    const [x, y] = window.getPosition()
    db.setKey('windowParams', `${window.name}.dimensions`, { width, height })
    db.setKey('windowParams', `${window.name}.positions`, { x, y })
  }

  window.on('resize', debounce(windowParamsHandler, 100))
  window.on('move', debounce(windowParamsHandler, 100))
}

const defaultWindowOptions = {
  // see https://github.com/electron-userland/electron-builder/issues/2269
  icon: i('browser-window-icon-512x512.png'),

  backgroundColor: '#fff',
  webPreferences: {
    blinkFeatures: 'OverlayScrollbars',
    devTools,
    // Enable, among other things, the ResizeObserver
    experimentalFeatures: true,
  },
}

async function createMainWindow() {
  const savedDimensions = await db.getKey('windowParams', 'MainWindow.dimensions', {})
  const savedPositions = await db.getKey('windowParams', 'MainWindow.positions', null)

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

  window.on('close', terminateAllTheThings)

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

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
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

app.on('ready', async () => {
  if (__DEV__) {
    await installExtensions()
  }

  Menu.setApplicationMenu(menu)

  mainWindow = await createMainWindow()
  await clearSessionCache(mainWindow.webContents.session)
})

function clearSessionCache(session) {
  return new Promise(r => session.clearCache(r))
}
