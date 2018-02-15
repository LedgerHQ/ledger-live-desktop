// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import debug from 'debug'

import type { Accounts } from 'types/common'

import { CHECK_UPDATE_TIMEOUT, SYNC_ACCOUNT_TIMEOUT } from 'constants'

import { updateDevices, addDevice, removeDevice } from 'actions/devices'
import { updateAccount } from 'actions/accounts'
import { setUpdateStatus } from 'reducers/update'
import { getAccountData, getAccounts, getAccountById } from 'reducers/accounts'
import { isLocked } from 'reducers/application'

import i18n from 'renderer/i18n'

const d = {
  device: debug('lwd:device'),
  sync: debug('lwd:sync'),
  update: debug('lwd:update'),
}

const { DISABLED_SYNC, DISABLED_AUTO_SYNC } = process.env

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
  d.sync('Sync accounts - start')
  syncAccounts = true
  sendEvent('accounts', 'sync.all', {
    accounts: accounts.map(account => {
      const currentIndex = get(account, 'data.currentIndex', 0)
      const allAddresses = get(account, 'data.allAddresses', [])
      return {
        id: account.id,
        allAddresses,
        currentIndex,
      }
    }),
  })
}

export function stopSyncAccounts() {
  d.sync('Sync accounts - stop')
  syncAccounts = false
  clearTimeout(syncTimeout)
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_TIMEOUT)
}

export default ({ store, locked }: { store: Object, locked: boolean }) => {
  const handlers = {
    dispatch: (type, payload) => store.dispatch({ type, payload }),
    application: {
      changeLanguage: lang => i18n.changeLanguage(lang),
    },
    account: {
      sync: {
        success: account => {
          if (syncAccounts) {
            const state = store.getState()
            const currentAccount = getAccountById(state, account.id) || {}
            const currentAccountData = getAccountData(state, account.id) || {}
            const currentAccountTransactions = get(currentAccountData, 'transactions', [])

            const transactions = uniqBy(
              [...currentAccountTransactions, ...account.transactions],
              tx => tx.hash,
            )

            if (currentAccountTransactions.length !== transactions.length) {
              d.sync(`Update account - ${currentAccount.name}`)
              store.dispatch(
                updateAccount({
                  ...account,
                  data: {
                    ...account.data,
                    transactions,
                  },
                }),
              )
            }
          }
        },
      },
    },
    accounts: {
      sync: {
        start: () => {
          if (!syncAccounts) {
            const state = store.getState()
            const accounts = getAccounts(state)
            const locked = isLocked(state)

            if (!locked && !DISABLED_SYNC) {
              startSyncAccounts(accounts)
            }
          }
        },
        stop: stopSyncAccounts,
        success: () => {
          if (syncAccounts && !DISABLED_AUTO_SYNC) {
            d.sync('Sync accounts - success')
            syncTimeout = setTimeout(() => {
              const accounts = getAccounts(store.getState())
              startSyncAccounts(accounts)
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
  sendEvent('usb', 'devices.listen')

  if (!locked && !DISABLED_SYNC) {
    const accounts = getAccounts(store.getState())

    // Start accounts sync only if we have accounts
    if (accounts.length > 0) {
      startSyncAccounts(accounts)
    }
  }

  if (__PROD__) {
    // Start check of eventual updates
    checkUpdates()
  }
}
