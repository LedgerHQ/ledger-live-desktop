// @flow

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

type SendFunction = (type: string, data: *) => void

export default (notify: SendFunction) => {
  autoUpdater.on('checking-for-update', () => notify('checking'))
  autoUpdater.on('update-available', info => notify('updateAvailable', info))
  autoUpdater.on('update-not-available', () => notify('updateNotAvailable'))
  autoUpdater.on('error', err => notify('error', err))
  autoUpdater.on('download-progress', progress => notify('downloadProgress', progress))
  autoUpdater.on('update-downloaded', () => notify('downloaded'))

  autoUpdater.checkForUpdatesAndNotify()
}

export function quitAndInstall() {
  setImmediate(() => {
    const browserWindows = BrowserWindow.getAllWindows()

    // Fixes quitAndInstall not quitting on macOS, as suggested on
    // https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-306709572
    app.removeAllListeners('window-all-closed')
    browserWindows.forEach(browserWindow => {
      browserWindow.removeAllListeners('close')
    })

    autoUpdater.quitAndInstall(false)
  })
}
