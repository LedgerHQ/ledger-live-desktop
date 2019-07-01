// @flow

import { createCommand, Command } from 'helpers/ipc'
import { Observable } from 'rxjs'
import logger from 'logger'

import { UPDATE_CHECK_IGNORE, UPDATE_CHECK_FEED } from 'config/constants'
import createElectronAppUpdater from 'main/updater/createElectronAppUpdater'
import type { UpdateStatus } from 'components/Updater/UpdaterContext'

type Input = {}
type Result = {
  status: UpdateStatus,
  payload?: *,
}

const cmd: Command<Input, Result> = createCommand('main:autoUpdate', () =>
  Observable.create(o => {
    const { autoUpdater } = require('@ledgerhq/electron-updater')

    const sendStatus = (status, payload) => {
      o.next({ status, payload })
    }

    const handleDownload = async info => {
      try {
        sendStatus('checking')
        const appUpdater = await createElectronAppUpdater({ feedURL: UPDATE_CHECK_FEED, info })
        await appUpdater.verify()
        sendStatus('check-success')
      } catch (err) {
        logger.critical(err)
        if (UPDATE_CHECK_IGNORE) {
          sendStatus('check-success')
        } else {
          o.error(err)
        }
      }
    }

    autoUpdater.on('checking-for-update', () => sendStatus('checking-for-update'))
    autoUpdater.on('update-available', info => sendStatus('update-available', info))
    autoUpdater.on('update-not-available', info => sendStatus('update-not-available', info))
    autoUpdater.on('download-progress', p => sendStatus('download-progress', p))
    autoUpdater.on('update-downloaded', handleDownload)
    autoUpdater.on('error', err => {
      logger.error(err)
      o.complete()
    })

    autoUpdater.autoInstallOnAppQuit = false
    autoUpdater.checkForUpdates()

    return () => {}
  }),
)

export default cmd
