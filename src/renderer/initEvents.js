// @flow

import { ipcRenderer } from 'electron' // eslint-disable-line import/no-extraneous-dependencies
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
    updater: {
      checking: () => {
        console.log('[UPDATER] checking for updates')
      },
      updateAvailable: info => {
        console.log('[UPDATER] update available', info)
      },
      updateNotAvailable: () => {
        console.log('[UPDATER] no update available')
      },
      error: err => {
        console.log('[UPDATER] update error', err)
      },
      downloadProgress: progress => {
        console.log('[UPDATER] download in progress...', progress.percent)
      },
      downloaded: () => {
        console.log('[UPDATER] update downloaded')
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
