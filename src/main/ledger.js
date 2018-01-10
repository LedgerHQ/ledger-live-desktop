// @flow

import { ipcMain } from 'electron'
import { isLedgerDevice } from 'ledgerco/lib/utils'
import ledgerco, { comm_node } from 'ledgerco'
import objectPath from 'object-path'

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

let isListenDevices = false

const handlers = {
  devices: {
    listen: send => {
      if (isListenDevices) {
        return
      }

      isListenDevices = true

      HID.listenDevices.start()

      HID.listenDevices.events.on(
        'add',
        device => isLedgerDevice(device) && send('device.add', device),
      )
      HID.listenDevices.events.on(
        'remove',
        device => isLedgerDevice(device) && send('device.remove', device),
      )
    },
    all: send => send('devices.update', HID.devices().filter(isLedgerDevice)),
  },
  wallet: {
    infos: {
      request: async (send, { path, wallet }) => {
        try {
          const publicKey = await getWalletInfos(path, wallet)
          send('wallet.infos.success', { path, publicKey })
        } catch (err) {
          send('wallet.infos.fail', { path, err: err.stack || err })
        }
      },
    },
  },
}

ipcMain.on('msg', (event: *, payload) => {
  const { type, data } = payload

  const handler = objectPath.get(handlers, type)
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
