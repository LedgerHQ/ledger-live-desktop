// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'

import { updateDevices, addDevice, removeDevice } from 'actions/devices'
import { syncAccount } from 'actions/accounts'
import { setUpdateStatus } from 'reducers/update'
import { getAccounts } from 'reducers/accounts'

type MsgPayload = {
  type: string,
  data: any,
}

// wait a bit before launching update check
const CHECK_UPDATE_TIMEOUT = 3e3
const SYNC_ACCOUNT_TIMEOUT = 5e3

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

function startSyncAccounts(store) {
  const accounts = getAccounts(store.getState())

  sendEvent('accounts', 'sync.all', {
    accounts: Object.entries(accounts).map(([id, account]: [string, any]) => ({
      id,
      currentIndex: account.data.currentIndex,
    })),
  })
}

export default (store: Object) => {
  const handlers = {
    accounts: {
      sync: {
        success: accounts => {
          accounts.forEach(account => store.dispatch(syncAccount(account)))
          setTimeout(() => startSyncAccounts(store), SYNC_ACCOUNT_TIMEOUT)
        },
      },
    },
    devices: {
      update: devices => {
        store.dispatch(updateDevices(devices))
      },
    },
    device: {
      add: device => store.dispatch(addDevice(device)),
      remove: device => store.dispatch(removeDevice(device)),
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

  // First time, we get all devices
  sendEvent('usb', 'devices.all')

  // Start detection when we plug/unplug devices
  sendEvent('usb', 'devices.listen')

  // Start accounts sync
  startSyncAccounts(store)

  if (__PROD__) {
    // Start check of eventual updates
    setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_TIMEOUT)
  }
}
