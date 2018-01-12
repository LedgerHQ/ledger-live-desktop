// @flow

import { autoUpdater } from 'electron-updater'

type ElectronWindow = {
  webContents: {
    send: (string, *) => void,
  },
}

export default (win: ElectronWindow) => {
  function notify(type: string, data: * = null) {
    win.webContents.send('msg', { type, data })
  }

  autoUpdater.on('checking-for-update', () => notify('updater.checking'))
  autoUpdater.on('update-available', info => notify('updater.updateAvailable', info))
  autoUpdater.on('update-not-available', () => notify('updater.updateNotAvailable'))
  autoUpdater.on('error', err => notify('updater.error', err))
  autoUpdater.on('download-progress', progress => notify('updater.downloadProgress', progress))
  autoUpdater.on('update-downloaded', () => notify('updater.downloaded'))

  autoUpdater.checkForUpdatesAndNotify()
}
