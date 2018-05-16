// @flow

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

type SendFunction = (type: string, data: *) => void

export default (notify: SendFunction) => {
  autoUpdater.on('checking-for-update', () => notify('updater.checking'))
  autoUpdater.on('update-available', info => notify('updater.updateAvailable', info))
  autoUpdater.on('update-not-available', () => notify('updater.updateNotAvailable'))
  autoUpdater.on('error', err => notify('updater.error', err))
  autoUpdater.on('download-progress', progress => notify('updater.downloadProgress', progress))
  autoUpdater.on('update-downloaded', () => notify('updater.downloaded'))

  autoUpdater.checkForUpdatesAndNotify()
}

export function quitAndInstall() {
  setImmediate(() => {
    const browserWindows = BrowserWindow.getAllWindows()

    app.removeAllListeners('window-all-closed')
    browserWindows.forEach(browserWindow => {
      browserWindow.removeAllListeners('close')
    })

    autoUpdater.quitAndInstall(false)
  })
}
