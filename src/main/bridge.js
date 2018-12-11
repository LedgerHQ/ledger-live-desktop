// @flow

import '@babel/polyfill'
import invariant from 'invariant'
import { fork } from 'child_process'
import { ipcMain, app } from 'electron'
import { ipcMainListenReceiveCommands } from 'helpers/ipc'
import path from 'path'
import logger from 'logger'
import sentry, { captureException } from 'sentry/node'
import user from 'helpers/user'
import { resolveLogsDirectory, cleanUpBeforeClosingSync } from 'helpers/log'
import { deserializeError } from 'helpers/errors'

import { setInternalProcessPID } from './terminator'

import { getMainWindow } from './app'

// sqlite files will be located in the app local data folder
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')
const LEDGER_LOGS_DIRECTORY = process.env.LEDGER_LOGS_DIRECTORY || resolveLogsDirectory()
const LEDGER_CONFIG_DIRECTORY = app.getPath('userData')

let internalProcess

let userId = null
let sentryEnabled = false

async function init() {
  const u = await user()
  userId = u.id
  sentry(() => sentryEnabled, userId)
}
init()

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
      IS_INTERNAL_PROCESS: 1,
      LEDGER_LOGS_DIRECTORY,
      LEDGER_CONFIG_DIRECTORY,
      LEDGER_LIVE_SQLITE_PATH,
      INITIAL_SENTRY_ENABLED: sentryEnabled,
      SENTRY_USER_ID: userId,
    },
  })
  setInternalProcessPID(internalProcess.pid)
  internalProcess.on('message', handleGlobalInternalMessage)
  internalProcess.on('exit', handleExit)
}

process.on('exit', () => {
  killInternalProcess()
  cleanUpBeforeClosingSync()
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
  switch (payload.type) {
    case 'uncaughtException': {
      const err = deserializeError(payload.error)
      captureException(err)
      break
    }
    case 'setLibcoreBusy':
    case 'setDeviceBusy':
    case 'executeHttpQueryOnRenderer': {
      const win = getMainWindow && getMainWindow()
      if (!win) {
        logger.warn(`can't ${payload.type} because no renderer`)
        return
      }
      win.webContents.send(payload.type, payload)
      break
    }
    default:
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
