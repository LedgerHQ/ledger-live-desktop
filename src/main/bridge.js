// @flow

import { fork } from 'child_process'
import { ipcMain } from 'electron'
import objectPath from 'object-path'
import { resolve } from 'path'

import setupAutoUpdater from './autoUpdate'

function onChannelUsb(callType) {
  return (event: any, payload) => {
    const { type, data } = payload

    const compute = fork(resolve(__dirname, `${__DEV__ ? '../../' : './'}dist/internals/usb`))

    compute.send({ type, data })
    compute.on('message', payload => {
      const { type, data, options = {} } = payload
      if (callType === 'async') {
        event.sender.send('msg', { type, data })
      }
      if (callType === 'sync') {
        event.returnValue = { type, data }
      }
      if (options.kill) {
        compute.kill()
      }
    })
  }
}

// Forwards every usb message to usb process
ipcMain.on('usb', onChannelUsb('async'))
ipcMain.on('usb:sync', onChannelUsb('sync'))

const handlers = {
  updater: {
    init: send => setupAutoUpdater(send),
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
