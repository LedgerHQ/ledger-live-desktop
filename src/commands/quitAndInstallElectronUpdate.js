// @flow

import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'

type Input = void
type Result = void

const cmd: Command<Input, Result> = createCommand('main:quitAndInstallElectronUpdate', () =>
  Observable.create(o => {
    const { app, BrowserWindow } = require('electron')
    const { autoUpdater } = require('@ledgerhq/electron-updater')
    const browserWindows = BrowserWindow.getAllWindows()

    // Fixes quitAndInstall not quitting on macOS, as suggested on
    // https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-306709572
    app.removeAllListeners('window-all-closed')
    browserWindows.forEach(browserWindow => {
      browserWindow.removeAllListeners('close')
    })

    // couldn't find a way to catch if fail ¯\_(ツ)_/¯
    autoUpdater.quitAndInstall(false)

    o.complete()
    return () => {}
  }),
)

export default cmd
