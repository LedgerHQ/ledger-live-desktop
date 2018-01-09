// @flow

import { ipcMain } from 'electron'
import { isLedgerDevice } from 'ledgerco/lib/utils'
import ledgerco, { comm_node } from 'ledgerco'

import HID from 'ledger-node-js-hid'

async function getWalletInfos(path: string, wallet: string) {
  if (wallet === 'btc') {
    const comm = new comm_node(new HID.HID(path), true, 0, false)
    const btc = new ledgerco.btc(comm)
    const walletInfos = await btc.getWalletPublicKey_async("44'/0'/0'/0")
    return walletInfos
  }
  throw new Error('invalid wallet')
}

const handlers = {
  listenDevices: send => {
    HID.listenDevices.start()
    HID.listenDevices.events.on(
      'add',
      device => isLedgerDevice(device) && send('addDevice', device),
    )
    HID.listenDevices.events.on(
      'remove',
      device => isLedgerDevice(device) && send('removeDevice', device),
    )
  },
  requestWalletInfos: async (send, { path, wallet }) => {
    try {
      const publicKey = await getWalletInfos(path, wallet)
      send('receiveWalletInfos', { path, publicKey })
    } catch (err) {
      send('failWalletInfos', { path, err: err.stack })
    }
  },
  getDevices: send => {
    send('updateDevices', HID.devices().filter(isLedgerDevice))
  },
}

ipcMain.on('msg', (event: *, payload) => {
  const { type, data } = payload

  const handler = handlers[type]
  if (!handler) {
    return
  }

  const send = (msgType: string, data: *) => {
    event.sender.send('msg', {
      type: msgType,
      data,
    })
  }

  handler(send, data)
})
