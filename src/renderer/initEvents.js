// @flow

import { ipcRenderer } from 'electron'

import { devicesUpdate, deviceAdd, deviceRemove } from 'actions/devices'

type MsgPayload = {
  type: string,
  data: *,
}

function send(msgType: string, data: *) {
  ipcRenderer.send('msg', {
    type: msgType,
    data,
  })
}

export default (store: Object) => {
  const handlers = {
    updateDevices: devices => {
      store.dispatch(devicesUpdate(devices))
      if (devices.length) {
        send('requestWalletInfos', {
          path: devices[0].path,
          wallet: 'btc',
        })
      }
    },
    addDevice: device => store.dispatch(deviceAdd(device)),
    removeDevice: device => store.dispatch(deviceRemove(device)),
    receiveWalletInfos: ({ path, publicKey }) => {
      console.log({ path, publicKey })
    },
    failWalletInfos: ({ path, err }) => {
      console.log({ path, err })
    },
  }

  ipcRenderer.on('msg', (e: *, payload: MsgPayload) => {
    const { type, data } = payload
    const handler = handlers[type]
    if (!handler) {
      return
    }
    handler(data)
  })

  // First time, we get all devices
  send('getDevices')

  // Start detection when we plug/unplug devices
  send('listenDevices')
}
