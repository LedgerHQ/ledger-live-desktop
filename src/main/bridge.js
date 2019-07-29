// @flow

import '@babel/polyfill'
import invariant from 'invariant'
import { fork } from 'child_process'
import { ipcMain, app } from 'electron'
import debounce from 'lodash/debounce'
import { ipcMainListenReceiveCommands } from 'helpers/ipc'
import path from 'path'
import logger from 'logger'
import LoggerTransport from 'logger/logger-transport-main'
import sentry, { captureException } from 'sentry/node'
import user from 'helpers/user'
import { executeCommand, unsubscribeCommand } from 'main/commandHandler'
import { cleanUpBeforeClosingSync } from 'helpers/log'
import { deserializeError } from '@ledgerhq/errors'
import { setEnvUnsafe, getAllEnvs } from '@ledgerhq/live-common/lib/env'
import { isRestartNeeded } from 'helpers/env'

import { setInternalProcessPID } from './terminator'

import { getMainWindow } from './app'

const loggerTransport = new LoggerTransport()
logger.add(loggerTransport)

// sqlite files will be located in the app local data folder
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')
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

const killInternalProcessDebounce = debounce(() => {
  killInternalProcess()
}, 500)

const forkBundlePath = path.resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals`)
const handleExit = code => {
  logger.warn(`Internal process ended with code ${code}`)
  internalProcess = null
}

const bootInternalProcess = () => {
  logger.log('booting internal process...')
  internalProcess = fork(forkBundlePath, {
    env: {
      ...getAllEnvs(),
      ...process.env,
      IS_INTERNAL_PROCESS: 1,
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

ipcMain.on('log', (e, { log }) => {
  logger.onLog(log)
})

ipcMainListenReceiveCommands({
  onUnsubscribe: requestId => {
    unsubscribeCommand(requestId)
    if (internalProcess) {
      internalProcess.send({ type: 'command-unsubscribe', requestId })
    }
  },
  onCommand: (command, notifyCommandEvent) => {
    // ability to run command from the main process
    if (command.id.startsWith('main:')) {
      executeCommand(command, notifyCommandEvent)
      return
    }

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
    case 'log':
      logger.onLog(payload.log)
      break
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

ipcMain.on('queryLogs', event => {
  event.sender.send('logs', { logs: loggerTransport.logs })
})

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

ipcMain.on('setEnv', (event, env) => {
  const { name, value } = env

  if (setEnvUnsafe(name, value)) {
    if (isRestartNeeded(name)) {
      killInternalProcessDebounce()
    } else {
      const p = internalProcess
      if (!p) return
      p.send({ type: 'setEnv', env })
    }
  }
})
