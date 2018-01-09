// @flow

import { ipcMain } from 'electron'
import { isLedgerDevice } from 'ledgerco/lib/utils'
import ledgerco, { comm_node } from 'ledgerco'

import HID from 'ledger-node-js-hid'

ipcMain.on('listenDevices', event => {
  HID.listenDevices.start()

  HID.listenDevices.events.on(
    'add',
    device => isLedgerDevice(device) && event.sender.send('addDevice', device),
  )

  HID.listenDevices.events.on(
    'remove',
    device => isLedgerDevice(device) && event.sender.send('removeDevice', device),
  )
})

async function getWalletInfos(path: string, wallet: string) {
  if (wallet === 'btc') {
    const comm = new comm_node(new HID.HID(path), true, 0, false)
    const btc = new ledgerco.btc(comm)
    const walletInfos = await btc.getWalletPublicKey_async("44'/0'/0'/0")
    return walletInfos
  }
  throw new Error('invalid wallet')
}

ipcMain.on('requestWalletInfos', async (event: *, payload) => {
  const { path, wallet } = payload
  try {
    const publicKey = await getWalletInfos(path, wallet)
    event.sender.send('receiveWalletInfos', { path, publicKey })
  } catch (err) {
    event.sender.send('failWalletInfos', { path, err: err.stack })
  }
})

ipcMain.on('getDevices', event =>
  event.sender.send('updateDevices', HID.devices().filter(isLedgerDevice)),
)
