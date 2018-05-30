// @flow

import '@babel/polyfill'
import invariant from 'invariant'
import { fork } from 'child_process'
import { ipcMain, app } from 'electron'
import { ipcMainListenReceiveCommands } from 'helpers/ipc'
import path from 'path'

import setupAutoUpdater, { quitAndInstall } from './autoUpdate'

// sqlite files will be located in the app local data folder
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')

let internalProcess

const killInternalProcess = () => {
  if (internalProcess) {
    console.log('killing internal process...')
    internalProcess.kill('SIGINT')
    internalProcess = null
  }
}

const forkBundlePath = path.resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals`)

const bootInternalProcess = () => {
  console.log('booting internal process...')
  internalProcess = fork(forkBundlePath, {
    env: { LEDGER_LIVE_SQLITE_PATH },
  })
  internalProcess.on('exit', code => {
    console.log(`Internal process ended with code ${code}`)
    internalProcess = null
  })
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
        type: 'ERROR',
        requestId: command.requestId,
        data: { message: `Internal process error (${code})`, name: 'InternalError' },
      })
    }

    const handleMessage = payload => {
      if (payload.requestId !== command.requestId) return
      notifyCommandEvent(payload)
      if (payload.type === 'ERROR' || payload.type === 'COMPLETE') {
        p.removeListener('message', handleMessage)
        p.removeListener('exit', handleExit)
      }
    }

    p.on('exit', handleExit)
    p.on('message', handleMessage)
    p.send({ type: 'command', command })
  },
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
