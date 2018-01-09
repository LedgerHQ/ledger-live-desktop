// @flow

import { ipcRenderer } from 'electron'

import { devicesUpdate, deviceAdd, deviceRemove } from 'actions/devices'

export default (store: Object) => {
  ipcRenderer.on('updateDevices', (e, devices) => {
    store.dispatch(devicesUpdate(devices))
    if (devices.length) {
      ipcRenderer.send('requestWalletInfos', { path: devices[0].path, wallet: 'btc' })
    }
  })

  ipcRenderer.on('addDevice', (e, device) => store.dispatch(deviceAdd(device)))
  ipcRenderer.on('removeDevice', (e, device) => store.dispatch(deviceRemove(device)))

  ipcRenderer.on('receiveWalletInfos', (e, { path, publicKey }) => {
    console.log({ path, publicKey })
  })

  ipcRenderer.on('failWalletInfos', (e, { path, err }) => {
    console.log({ path, err })
  })

  // First time, we get all devices
  ipcRenderer.send('getDevices')

  // Start detection when we plug/unplug devices
  ipcRenderer.send('listenDevices')
}
