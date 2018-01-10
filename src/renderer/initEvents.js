// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'

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
    devices: {
      update: devices => {
        store.dispatch(devicesUpdate(devices))
        if (devices.length) {
          send('wallet.infos.request', {
            path: devices[0].path,
            wallet: 'btc',
          })
        }
      },
    },
    device: {
      add: device => store.dispatch(deviceAdd(device)),
      remove: device => store.dispatch(deviceRemove(device)),
    },
    wallet: {
      infos: {
        success: ({ path, publicKey }) => {
          console.log({ path, publicKey })
        },
        fail: ({ path, err }) => {
          console.log({ path, err })
        },
      },
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
  send('devices.all')

  // Start detection when we plug/unplug devices
  send('devices.listen')
}
