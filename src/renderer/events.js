// @flow

// FIXME this file is spaghetti. we need one file per usecase.

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'
import debug from 'debug'
import type { Account } from '@ledgerhq/live-common/lib/types'

import { CHECK_UPDATE_DELAY, SYNC_ACCOUNT_DELAY } from 'config/constants'

import { getAccounts, getAccountById } from 'reducers/accounts'
import { isLocked } from 'reducers/application'
import { setUpdateStatus } from 'reducers/update'

import { updateAccount } from 'actions/accounts'
import { addDevice, removeDevice } from 'actions/devices'

import i18n from 'renderer/i18n/electron'

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

let syncAccountsInProgress = false
let syncAccountsTimeout

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

export default ({ store, locked }: { store: Object, locked: boolean }) => {
  const handlers = {
    dispatch: ({ type, payload }) => store.dispatch({ type, payload }),
    application: {
      changeLanguage: lang => i18n.changeLanguage(lang),
    },
    account: {
      sync: {
        success: account => {
          if (syncAccountsInProgress) {
            const state = store.getState()
            const existingAccount = getAccountById(state, account.id)

            if (!existingAccount) {
              return
            }

            const { name, balance, balanceByDay, operations } = existingAccount

            if (account.operations.length > 0) {
              d.sync(`Update account - ${name}`)
              const updatedAccount = {
                ...account,
                balance: balance + account.balance,
                balanceByDay: Object.keys(balanceByDay).reduce((result, k) => {
                  result[k] = balanceByDay[k] + (account.balanceByDay[k] || 0)
                  return result
                }, {}),
                index: account.index || existingAccount.index,
                operations: [...operations, ...account.operations],
              }
              store.dispatch(updateAccount(updatedAccount))
            }
          }
        },
      },
    },
    accounts: {
      sync: {
        start: () => {
          if (!syncAccountsInProgress) {
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
          if (syncAccountsInProgress && !DISABLED_AUTO_SYNC) {
            d.sync('Sync accounts - success')
            syncAccountsTimeout = setTimeout(() => {
              const accounts = getAccounts(store.getState())
              startSyncAccounts(accounts)
            }, SYNC_ACCOUNT_DELAY)
          }
        },
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
  sendEvent('devices', 'listen')

  const state = store.getState()

  if (!locked) {
    const accounts = getAccounts(state)

    // Start accounts sync only if we have accounts
    if (accounts.length > 0 && !DISABLED_SYNC) {
      startSyncAccounts(accounts)
    }
  }

  if (__PROD__) {
    // Start check of eventual updates
    checkUpdates()
  }
}

export function startSyncAccounts(accounts: Account[]) {
  d.sync('Sync accounts - start')
  syncAccountsInProgress = true
  sendEvent('accounts', 'sync', {
    accounts: accounts.map(account => {
      const { id, currency, walletPath, addresses, index, operations } = account
      return {
        id,
        currencyId: currency.id,
        allAddresses: addresses,
        currentIndex: index,
        walletPath,
        operations,
      }
    }),
  })
}

export function stopSyncAccounts() {
  d.sync('Sync accounts - stop')
  syncAccountsInProgress = false
  clearTimeout(syncAccountsTimeout)
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_DELAY)
}
