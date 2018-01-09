// @flow

import { ipcRenderer } from 'electron'

import { devicesUpdate, deviceAdd, deviceRemove } from 'actions/devices'

export default (store: Object) => {
  ipcRenderer.on('updateDevices', (e, devices) => store.dispatch(devicesUpdate(devices)))
  ipcRenderer.on('addDevice', (e, device) => store.dispatch(deviceAdd(device)))
  ipcRenderer.on('removeDevice', (e, device) => store.dispatch(deviceRemove(device)))

  // First time, we get all devices
  ipcRenderer.send('getDevices')

  // Start detection when we plug/unplug devices
  ipcRenderer.send('listenDevices')
}
