// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'
import get from 'lodash/get'

import type { Accounts } from 'types/common'

import { CHECK_UPDATE_TIMEOUT, SYNC_ACCOUNT_TIMEOUT } from 'constants'

import { updateDevices, addDevice, removeDevice } from 'actions/devices'
import { syncAccount } from 'actions/accounts'
import { setUpdateStatus } from 'reducers/update'
import { getAccounts } from 'reducers/accounts'

type MsgPayload = {
  type: string,
  data: any,
}

let syncAccounts = true
let syncTimeout

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

export function startSyncAccounts(accounts: Accounts) {
  syncAccounts = true

  sendEvent('accounts', 'sync.all', {
    accounts: Object.entries(accounts).map(([id, account]: [string, any]) => {
      const currentIndex = get(account, 'data.currentIndex', 0)
      return {
        id,
        currentIndex,
      }
    }),
  })
}

export function stopSyncAccounts() {
  syncAccounts = false
  clearTimeout(syncTimeout)
}

export function checkUpdates() {
  setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_TIMEOUT)
}

export default ({ store, locked }: { store: Object, locked: boolean }) => {
  const handlers = {
    accounts: {
      sync: {
        success: accounts => {
          if (syncAccounts) {
            accounts.forEach(
              account => account.transactions.length > 0 && store.dispatch(syncAccount(account)),
            )
            syncTimeout = setTimeout(() => {
              const newAccounts = getAccounts(store.getState())
              startSyncAccounts(newAccounts)
            }, SYNC_ACCOUNT_TIMEOUT)
          }
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

  // Start detection when we plug/unplug devices
  sendEvent('usb', 'devices.listen')

  if (!locked) {
    const accounts = getAccounts(store.getState())

    // Start accounts sync
    startSyncAccounts(accounts)
  }

  if (__PROD__) {
    // Start check of eventual updates
    checkUpdates()
  }
}
