// @flow

import { fork } from 'child_process'
import { ipcMain } from 'electron'
import { resolve } from 'path'

ipcMain.on('msg', (event: any, payload) => {
  const { type, data } = payload

  const compute = fork('./usb', {
    cwd: resolve(__dirname, './'),
  })

  const send = (msgType, data) => {
    event.sender.send('msg', {
      type: msgType,
      data,
    })
  }

  compute.send({ type, data })
  compute.on('message', payload => {
    const { type, data, options = {} } = payload
    send(type, data)
    if (options.kill) {
      compute.kill()
    }
  })
})
