// @flow

import objectPath from 'object-path'

import devices from './devices'
import wallet from './wallet'

process.title = 'ledger-wallet-desktop-usb'

function send(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

const handlers = {
  devices: devices(send),
  wallet: wallet(send),
}

process.on('message', payload => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    return
  }
  handler(data)
})
