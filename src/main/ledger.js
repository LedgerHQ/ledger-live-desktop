import { ipcMain } from 'electron'
import { isLedgerDevice } from 'ledgerco/lib/utils'

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

ipcMain.on('getDevices', event =>
  event.sender.send('updateDevices', HID.devices().filter(isLedgerDevice)),
)
