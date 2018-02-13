// @flow

import { fork } from 'child_process'
import { BrowserWindow, ipcMain } from 'electron'
import objectPath from 'object-path'
import { resolve } from 'path'

import cpuUsage from 'helpers/cpuUsage'

import setupAutoUpdater, { quitAndInstall } from './autoUpdate'

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

function onForkChannel(forkType, callType) {
  return (event: any, payload) => {
    const { type, data } = payload

    let compute = fork(resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals`), {
      env: {
        FORK_TYPE: forkType,
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
        if (callType === 'async') {
          event.sender.send('msg', { type, data })
        }
        if (callType === 'sync') {
          event.returnValue = { type, data }
        }
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
ipcMain.on('usb', onForkChannel('usb', 'async'))
ipcMain.on('accounts', onForkChannel('accounts', 'async'))

ipcMain.on('clean-processes', cleanProcesses)

const handlers = {
  updater: {
    init: setupAutoUpdater,
    quitAndInstall,
  },
}

ipcMain.on('msg', (event: any, payload) => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    return
  }
  const send = (type: string, data: *) => event.sender.send('msg', { type, data })
  handler(send, data, type)
})

if (__DEV__) {
  cpuUsage(cpuPercent =>
    sendEventToWindow('DevWindow', {
      type: 'usage.cpu',
      data: { name: 'main', value: cpuPercent },
    }),
  )
}
