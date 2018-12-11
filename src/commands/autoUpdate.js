// @flow

import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'

import createElectronAppUpdater from 'main/updater/createElectronAppUpdater'
import type { UpdateStatus } from 'components/Updater/UpdaterContext'

type Input = {}
type Result = {
  status: UpdateStatus,
  payload?: *,
}

const cmd: Command<Input, Result> = createCommand('main:autoUpdate', () =>
  Observable.create(o => {
    const { autoUpdater } = require('electron-updater')

    const sendStatus = (status, payload) => {
      o.next({ status, payload })
    }

    const handleDownload = async info => {
      try {
        const appUpdater = await createElectronAppUpdater({
          feedURL: process.env.LL_UPDATE_FEED || 'https://insert.feed.here',
          updateVersion: info.version,
        })
        await appUpdater.verify()
        sendStatus('check-success')
      } catch (err) {
        // todo delete update file
        o.error(err)
      }
    }

    autoUpdater.on('checking-for-update', () => sendStatus('checking-for-update'))
    autoUpdater.on('update-available', info => sendStatus('update-available', info))
    autoUpdater.on('update-not-available', info => sendStatus('update-not-available', info))
    autoUpdater.on('download-progress', p => sendStatus('download-progress', p))
    autoUpdater.on('update-downloaded', handleDownload)
    autoUpdater.on('error', err => o.error(err))

    autoUpdater.autoInstallOnAppQuit = false
    autoUpdater.checkForUpdates()

    return () => {}
  }),
)

export default cmd
