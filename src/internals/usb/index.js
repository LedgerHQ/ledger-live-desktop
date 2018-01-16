// @flow

import objectPath from 'object-path'

import devices from './devices'
import wallet from './wallet'

process.title = 'ledger-wallet-desktop-usb'

function sendEvent(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

const handlers = {
  devices: devices(sendEvent),
  wallet: wallet(sendEvent),
}

process.on('message', payload => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    return
  }
  handler(data)
})
