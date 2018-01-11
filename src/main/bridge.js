// @flow

import { fork } from 'child_process'
import { ipcMain } from 'electron' // eslint-disable-line import/no-extraneous-dependencies
import { resolve } from 'path'

// $FlowFixMe
import usbBridge from 'file-loader!babel-loader!./usb' // eslint-disable-line import/no-webpack-loader-syntax

ipcMain.on('msg', (event: any, payload) => {
  const { type, data } = payload

  const compute = fork(usbBridge, {
    cwd: resolve(__dirname, '../../dist/main'),
  })

  compute.send({ type, data })
  compute.on('message', payload => {
    const { type, data, options = {} } = payload
    event.sender.send('msg', { type, data })
    if (options.kill) {
      compute.kill()
    }
  })
})
