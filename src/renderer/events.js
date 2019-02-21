// @flow

// FIXME this file is spaghetti. we need one file per usecase.

// TODO to improve current state:
// a sendEventPromise version that returns a promise
// a sendEventObserver version that takes an observer & return a Subscription
// both of these implementation should have a unique requestId to ensure there is no collision
// events should all appear in the promise result / observer msgs as soon as they have this requestId

import 'commands'
import { ipcRenderer } from 'electron'
import debug from 'debug'

import network from 'api/network'
import logger from 'logger'
import db from 'helpers/db'

import { CHECK_UPDATE_DELAY, DISABLE_ACTIVITY_INDICATORS } from 'config/constants'
import { onSetDeviceBusy } from 'components/DeviceBusyIndicator'
import { onSetLibcoreBusy } from 'components/LibcoreBusyIndicator'

import { lock } from 'reducers/application'
import { addDevice, removeDevice, resetDevices } from 'actions/devices'

import listenDevices from 'commands/listenDevices'

const d = {
  device: debug('lwd:device'),
  sync: debug('lwd:sync'),
  update: debug('lwd:update'),
}

// TODO port remaining to command pattern
export function sendEvent(channel: string, msgType: string, data: any) {
  ipcRenderer.send(channel, {
    type: msgType,
    data,
  })
}

let syncDeviceSub
export default ({ store }: { store: Object }) => {
  // Ensure all sub-processes are killed before creating new ones (dev mode...)
  ipcRenderer.send('clean-processes')

  if (syncDeviceSub) {
    syncDeviceSub.unsubscribe()
    syncDeviceSub = null
  }

  function syncDevices() {
    syncDeviceSub = listenDevices.send().subscribe(
      ({ device, deviceModel, type }) => {
        if (device) {
          const stateDevice = {
            path: device.path,
            modelId: deviceModel ? deviceModel.id : 'nanoS',
            type: 'hid',
          }
          if (type === 'add') {
            d.device('Device - add')
            store.dispatch(addDevice(stateDevice))
          } else if (type === 'remove') {
            d.device('Device - remove')
            store.dispatch(removeDevice(stateDevice))
          }
        }
      },
      error => {
        logger.warn('listenDevices error', error)
        store.dispatch(resetDevices())
        syncDevices()
      },
      () => {
        logger.warn('listenDevices ended unexpectedly. restarting')
        store.dispatch(resetDevices())
        syncDevices()
      },
    )
  }

  syncDevices()

  ipcRenderer.on('lock', () => {
    if (db.hasEncryptionKey('app', 'accounts')) {
      store.dispatch(lock())
    }
  })

  ipcRenderer.on('executeHttpQueryOnRenderer', (event: any, { networkArg, id }) => {
    network(networkArg).then(
      result => {
        ipcRenderer.send('executeHttpQueryPayload', { type: 'success', id, result })
      },
      error => {
        ipcRenderer.send('executeHttpQueryPayload', { type: 'error', id, error })
      },
    )
  })

  if (!DISABLE_ACTIVITY_INDICATORS) {
    ipcRenderer.on('setLibcoreBusy', (event: any, { busy }) => {
      onSetLibcoreBusy(busy)
    })

    ipcRenderer.on('setDeviceBusy', (event: any, { busy }) => {
      onSetDeviceBusy(busy)
    })
  }
}

if (module.hot) {
  module.hot.accept('commands', () => {
    ipcRenderer.send('clean-processes')
  })
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('updater', 'init'), CHECK_UPDATE_DELAY)
}
