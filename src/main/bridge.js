// @flow

import { fork } from 'child_process'
import { ipcMain } from 'electron'
import objectPath from 'object-path'
import { resolve } from 'path'

import setupAutoUpdater, { quitAndInstall } from './autoUpdate'

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

    const onMessage = payload => {
      const { type, data, options = {} } = payload
      if (callType === 'async') {
        event.sender.send('msg', { type, data })
      }
      if (callType === 'sync') {
        event.returnValue = { type, data }
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
  handler(send, data)
})
