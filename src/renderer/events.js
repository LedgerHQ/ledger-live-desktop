// @flow

// FIXME this file is spaghetti. we need one file per usecase.

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'
import debug from 'debug'

import { CHECK_UPDATE_DELAY } from 'config/constants'

import { setUpdateStatus } from 'reducers/update'

import { addDevice, removeDevice } from 'actions/devices'

import i18n from 'renderer/i18n/electron'

const d = {
  device: debug('lwd:device'),
  sync: debug('lwd:sync'),
  update: debug('lwd:update'),
}

type MsgPayload = {
  type: string,
  data: any,
}

export function sendEvent(channel: string, msgType: string, data: any) {
  ipcRenderer.send(channel, {
    type: msgType,
    data,
  })
}

export function sendSyncEvent(channel: string, msgType: string, data: any): any {
  return ipcRenderer.sendSync(`${channel}:sync`, {
    type: msgType,
    data,
  })
}

export default ({ store }: { store: Object, locked: boolean }) => {
  const handlers = {
    dispatch: ({ type, payload }) => store.dispatch({ type, payload }),
    application: {
      changeLanguage: lang => i18n.changeLanguage(lang),
    },
    device: {
      add: device => {
        d.device('Device - add')
        store.dispatch(addDevice(device))
      },
      remove: device => {
        d.device('Device - remove')
        store.dispatch(removeDevice(device))
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

  ipcRenderer.on('msg', (event: any, payload: MsgPayload) => {
    const { type, data } = payload
    const handler = objectPath.get(handlers, type)
    if (!handler) {
      return
    }
    handler(data)
  })

  // Ensure all sub-processes are killed before creating new ones (dev mode...)
  ipcRenderer.send('clean-processes')

  // Start detection when we plug/unplug devices
  sendEvent('devices', 'listen')

  if (__PROD__) {
    // Start check of eventual updates
    checkUpdates()
  }
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_DELAY)
}
