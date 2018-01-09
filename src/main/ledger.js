import { ipcMain } from 'electron'
import { isLedgerDevice } from 'ledgerco/lib/utils'

import HID from 'ledger-node-js-hid'

ipcMain.on('listenDevices', event => {
  HID.listenDevices.start()

  HID.listenDevices.events.on('add', device => {
    console.log('add', device, isLedgerDevice(device))
    if (isLedgerDevice(device)) {
      event.sender.send('addDevice', device)
    }
  })

  HID.listenDevices.events.on('remove', device => {
    console.log('remove', device, isLedgerDevice(device))
    if (isLedgerDevice(device)) {
      event.sender.send('removeDevice', device)
    }
  })
})
