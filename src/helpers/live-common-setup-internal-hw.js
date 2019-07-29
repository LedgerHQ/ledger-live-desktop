// @flow
import { throwError, Observable } from 'rxjs'
import throttle from 'lodash/throttle'
import '@ledgerhq/live-common/lib/load/tokens/ethereum/erc20'
import { registerTransportModule } from '@ledgerhq/live-common/lib/hw'
import { addAccessHook, setErrorRemapping } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import { setEnvUnsafe, getEnv } from '@ledgerhq/live-common/lib/env'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import TransportNodeHidSingleton from '@ledgerhq/hw-transport-node-hid-singleton'
import TransportHttp from '@ledgerhq/hw-transport-http'
import { DisconnectedDevice } from '@ledgerhq/errors'
import { LISTEN_DEVICES_DEBOUNCE } from 'config/constants'
import { retry } from './promise'
import './implement-libcore'
import './live-common-set-supported-currencies'

/* eslint-disable guard-for-in */
for (const k in process.env) {
  setEnvUnsafe(k, process.env[k])
}
/* eslint-enable guard-for-in */

process.on('message', message => {
  if (message.type === 'setEnv') {
    const { name, value } = message.env

    setEnvUnsafe(name, value)
  }
})

let busy = false

TransportNodeHid.setListenDevicesPollingSkip(() => busy)
TransportNodeHid.setListenDevicesDebounce(LISTEN_DEVICES_DEBOUNCE)

const refreshBusyUIState = throttle(() => {
  if (process.env.CLI) return
  process.send({
    type: 'setDeviceBusy',
    busy,
  })
}, 100)

addAccessHook(() => {
  busy = true
  refreshBusyUIState()
  return () => {
    busy = false
    refreshBusyUIState()
  }
})

setErrorRemapping(e => {
  // NB ideally we should solve it in ledgerjs
  if (e && e.message && e.message.indexOf('HID') >= 0) {
    return throwError(new DisconnectedDevice(e.message))
  }
  return throwError(e)
})

if (getEnv('DEVICE_PROXY_URL')) {
  const Tr = TransportHttp(getEnv('DEVICE_PROXY_URL').split('|'))

  registerTransportModule({
    id: 'proxy',
    open: () => retry(() => Tr.create(3000, 5000)),
    disconnect: () => Promise.resolve(),
  })
} else {
  registerTransportModule({
    id: 'hid',
    open: devicePath =>
      retry(
        () =>
          getEnv('EXPERIMENTAL_USB')
            ? TransportNodeHidSingleton.open()
            : TransportNodeHid.open(devicePath),
        { maxRetry: 4 },
      ),
    disconnect: () => Promise.resolve(),
  })
}

export const listenDevices = (): * =>
  getEnv('EXPERIMENTAL_USB')
    ? Observable.create(TransportNodeHidSingleton.listen)
    : Observable.create(TransportNodeHid.listen)
