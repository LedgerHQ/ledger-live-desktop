// @flow

import { ipcRenderer } from 'electron'
import objectPath from 'object-path'
import debug from 'debug'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { Account } from 'types/common'

import { CHECK_UPDATE_DELAY, SYNC_ACCOUNT_DELAY, SYNC_COUNTER_VALUES_DELAY } from 'constants'

import { getAccounts, getAccountById } from 'reducers/accounts'
import { getCounterValue } from 'reducers/settings'
import { isLocked } from 'reducers/application'
import { setUpdateStatus } from 'reducers/update'

import { updateLastCounterValueBySymbol } from 'actions/counterValues'
import { updateAccount } from 'actions/accounts'
import { updateDevices, addDevice, removeDevice } from 'actions/devices'

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

let syncCounterValuesTimeout

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

export function startSyncAccounts(accounts: Account[]) {
  d.sync('Sync accounts - start')
  syncAccountsInProgress = true
  sendEvent('accounts', 'sync.all', {
    accounts: accounts.map(account => {
      const { id, coinType, rootPath, addresses, index, operations } = account
      return {
        id,
        coinType,
        allAddresses: addresses,
        currentIndex: index,
        rootPath,
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

export function startSyncCounterValues(counterValue: string, accounts: Account[]) {
  d.sync('Sync counterValues - start')

  sendEvent('msg', 'counterValues.sync', {
    counterValue,
    currencies: [
      ...new Set(accounts.map(account => getDefaultUnitByCoinType(account.coinType).code)),
    ],
  })
}

export function stopSyncCounterValues() {
  d.sync('Sync counterValues - stop')
  clearTimeout(syncCounterValuesTimeout)
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('msg', 'updater.init'), CHECK_UPDATE_DELAY)
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
    counterValues: {
      update: counterValues => {
        counterValues.map(c => store.dispatch(updateLastCounterValueBySymbol(c.symbol, c.value)))

        syncCounterValuesTimeout = setTimeout(() => {
          const state = store.getState()
          const accounts = getAccounts(state)
          const counterValue = getCounterValue(state)
          startSyncCounterValues(counterValue, accounts)
        }, SYNC_COUNTER_VALUES_DELAY)
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

  const state = store.getState()

  if (!locked) {
    const accounts = getAccounts(state)
    const counterValue = getCounterValue(state)

    startSyncCounterValues(counterValue, accounts)

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
