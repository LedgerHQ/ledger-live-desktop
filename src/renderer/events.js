// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'

import { updateDevices, addDevice, removeDevice } from 'actions/devices'
import { setCurrentWallet } from 'actions/wallets'
import { setUpdateStatus } from 'reducers/update'

type MsgPayload = {
  type: string,
  data: *,
}

// wait a bit before launching update check
const CHECK_UPDATE_TIMEOUT = 3e3

export function sendEvent(channel: string, msgType: string, data: any) {
  ipcRenderer.send(channel, {
    type: msgType,
    data,
  })
}

export default (store: Object) => {
  const handlers = {
    devices: {
      update: devices => {
        store.dispatch(updateDevices(devices))
      },
    },
    device: {
      add: device => store.dispatch(addDevice(device)),
      remove: device => store.dispatch(removeDevice(device)),
    },
    wallet: {
      infos: {
        success: ({ wallet, data }) => store.dispatch(setCurrentWallet({ wallet, data })),
        fail: ({ wallet, err }) => store.dispatch(setCurrentWallet({ wallet, err })),
      },
    },
    updater: {
      checking: () => store.dispatch(setUpdateStatus('checking')),
      updateAvailable: info => store.dispatch(setUpdateStatus('available', info)),
      updateNotAvailable: () => store.dispatch(setUpdateStatus('unavailable')),
      error: err => store.dispatch(setUpdateStatus('error', err)),
      downloadProgress: progress => store.dispatch(setUpdateStatus('progress', progress)),
      downloaded: () => store.dispatch(setUpdateStatus('downloaded')),
    },
  }

  ipcRenderer.on('msg', (e: *, payload: MsgPayload) => {
    const { type, data } = payload

    const handler = objectPath.get(handlers, type)
    if (!handler) {
      return
    }

    handler(data)
  })

  // First time, we get all devices
  sendEvent('usb', 'devices.all')

  // Start detection when we plug/unplug devices
  sendEvent('usb', 'devices.listen')

  if (__PROD__) {
    // Start check of eventual updates
    setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_TIMEOUT)
  }
}
