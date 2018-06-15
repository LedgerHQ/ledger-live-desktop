// @flow

import '@babel/polyfill'
import invariant from 'invariant'
import { fork } from 'child_process'
import { ipcMain, app } from 'electron'
import { ipcMainListenReceiveCommands } from 'helpers/ipc'
import path from 'path'
import logger from 'logger'
import sentry from 'sentry/node'
import user from 'helpers/user'

import setupAutoUpdater, { quitAndInstall } from './autoUpdate'

import { getMainWindow } from './app'

// sqlite files will be located in the app local data folder
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')

let internalProcess

let sentryEnabled = false
const userId = user().id

sentry(() => sentryEnabled, userId)

const killInternalProcess = () => {
  if (internalProcess) {
    logger.log('killing internal process...')
    internalProcess.removeListener('exit', handleExit)
    internalProcess.kill('SIGINT')
    internalProcess = null
  }
}

const forkBundlePath = path.resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals`)
const handleExit = code => {
  logger.warn(`Internal process ended with code ${code}`)
  internalProcess = null
}

const bootInternalProcess = () => {
  logger.log('booting internal process...')
  internalProcess = fork(forkBundlePath, {
    env: {
      ...process.env,
      LEDGER_LIVE_SQLITE_PATH,
      INITIAL_SENTRY_ENABLED: sentryEnabled,
      SENTRY_USER_ID: userId,
    },
  })
  internalProcess.on('message', handleGlobalInternalMessage)
  internalProcess.on('exit', handleExit)
}

process.on('exit', () => {
  killInternalProcess()
})

ipcMain.on('clean-processes', () => {
  killInternalProcess()
})

ipcMainListenReceiveCommands({
  onUnsubscribe: requestId => {
    if (!internalProcess) return
    internalProcess.send({ type: 'command-unsubscribe', requestId })
  },
  onCommand: (command, notifyCommandEvent) => {
    if (!internalProcess) bootInternalProcess()
    const p = internalProcess
    invariant(p, 'internalProcess not started !?')

    const handleExit = code => {
      p.removeListener('message', handleMessage)
      p.removeListener('exit', handleExit)
      notifyCommandEvent({
        type: 'cmd.ERROR',
        requestId: command.requestId,
        data: { message: `Internal process error (${code})`, name: 'InternalError' },
      })
    }

    const handleMessage = payload => {
      if (payload.requestId !== command.requestId) return
      notifyCommandEvent(payload)
      if (payload.type === 'cmd.ERROR' || payload.type === 'cmd.COMPLETE') {
        p.removeListener('message', handleMessage)
        p.removeListener('exit', handleExit)
      }
    }

    p.on('exit', handleExit)
    p.on('message', handleMessage)
    p.send({ type: 'command', command })
  },
})

function handleGlobalInternalMessage(payload) {
  if (payload.type === 'executeHttpQueryOnRenderer') {
    const win = getMainWindow && getMainWindow()
    if (!win) {
      logger.warn("can't executeHttpQueryOnRenderer because no renderer")
      return
    }
    win.webContents.send('executeHttpQuery', {
      id: payload.id,
      networkArg: payload.networkArg,
    })
  }
}

ipcMain.on('executeHttpQueryPayload', (event, payload) => {
  const p = internalProcess
  if (!p) return
  p.send({ type: 'executeHttpQueryPayload', payload })
})

ipcMain.on('sentryLogsChanged', (event, payload) => {
  sentryEnabled = payload.value
  const p = internalProcess
  if (!p) return
  p.send({ type: 'sentryLogsChanged', payload })
})

// TODO move this to "command" pattern
ipcMain.on('updater', (event, { type, data }) => {
  const handler = {
    init: setupAutoUpdater,
    quitAndInstall,
  }[type]
  const send = (type: string, data: *) => event.sender.send('updater', { type, data })
  handler(send, data, type)
})
