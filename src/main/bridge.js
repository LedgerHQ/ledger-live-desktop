// @flow

import '@babel/polyfill'
import { fork } from 'child_process'
import { BrowserWindow, ipcMain, app } from 'electron'
import objectPath from 'object-path'
import path from 'path'

import cpuUsage from 'helpers/cpuUsage'

import setupAutoUpdater, { quitAndInstall } from './autoUpdate'

const { DEV_TOOLS } = process.env

// sqlite files will be located in the app local data folder
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')

const processes = []

function cleanProcesses() {
  processes.forEach(kill => kill())
}

function sendEventToWindow(name, { type, data }) {
  const anotherWindow = BrowserWindow.getAllWindows().find(w => w.name === name)
  if (anotherWindow) {
    anotherWindow.webContents.send('msg', { type, data })
  }
}

function onForkChannel(forkType) {
  return (event: any, payload) => {
    const { type, data } = payload

    let compute = fork(path.resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals`), {
      env: {
        DEV_TOOLS,
        FORK_TYPE: forkType,
        LEDGER_LIVE_SQLITE_PATH,
      },
    })

    const kill = () => {
      if (compute) {
        compute.kill('SIGINT')
        compute = null
      }
    }

    processes.push(kill)

    const onMessage = payload => {
      const { type, data, options = {} } = payload

      if (options.window) {
        sendEventToWindow(options.window, { type, data })
      } else {
        event.sender.send('msg', { type, data })
      }
      if (options.kill && compute) {
        kill()
      }
    }

    compute.on('message', onMessage)
    compute.send({ type, data })

    process.on('exit', kill)
  }
}

// Forwards every `type` messages to another process
ipcMain.on('devices', onForkChannel('devices'))
ipcMain.on('accounts', onForkChannel('accounts'))
ipcMain.on('manager', onForkChannel('manager'))

ipcMain.on('clean-processes', cleanProcesses)

const handlers = {
  updater: {
    init: setupAutoUpdater,
    quitAndInstall,
  },
  kill: {
    process: (send, { pid }) => {
      try {
        process.kill(pid, 'SIGINT')
      } catch (e) {} // eslint-disable-line no-empty
    },
  },
}

ipcMain.on('msg', (event: any, payload) => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    console.warn(`No handler found for ${type}`)
    return
  }
  const send = (type: string, data: *) => event.sender.send('msg', { type, data })
  handler(send, data, type)
})

if (__DEV__ || DEV_TOOLS) {
  cpuUsage(cpuPercent =>
    sendEventToWindow('DevWindow', {
      type: 'usage.cpu',
      data: { name: 'main', value: cpuPercent },
    }),
  )
}
