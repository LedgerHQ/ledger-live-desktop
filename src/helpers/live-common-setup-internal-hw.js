// @flow
import logger from 'logger'
import { throwError } from 'rxjs'
import { registerTransportModule } from '@ledgerhq/live-common/lib/hw'
import { listen as listenLogs } from '@ledgerhq/logs'
import { addAccessHook, setErrorRemapping } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import { setEnvUnsafe, getEnv } from '@ledgerhq/live-common/lib/env'
import { retry } from '@ledgerhq/live-common/lib/promise'
import throttle from 'lodash/throttle'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import TransportHttp from '@ledgerhq/hw-transport-http'
import { DisconnectedDevice } from '@ledgerhq/errors'
import './implement-libcore'

listenLogs(({ id, date, ...log }) => logger.debug(log))

/* eslint-disable guard-for-in */
for (const k in process.env) {
  setEnvUnsafe(k, process.env[k])
}
/* eslint-enable guard-for-in */

let busy = false

TransportNodeHid.setListenDevicesPollingSkip(() => busy)

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
  let openedT = null
  const experimentalOpenHID = async () => {
    if (openedT) return openedT
    try {
      // $FlowFixMe
      const t = await TransportNodeHid.open('')
      const onDisconnect = () => {
        openedT = null
        t.off('disconnect', onDisconnect)
      }
      t.on('disconnect', onDisconnect)
      t.close = () => Promise.resolve(true)
      openedT = t
      return t
    } catch (e) {
      openedT = null
      throw e
    }
  }

  const legacyOpenHID = (devicePath: string) =>
    retry(() => TransportNodeHid.open(devicePath), { maxRetry: 4 })

  registerTransportModule({
    id: 'hid',
    open: devicePath => {
      if (getEnv('EXPERIMENTAL_USB')) {
        return experimentalOpenHID()
      }
      return legacyOpenHID(devicePath)
    },
    disconnect: () => Promise.resolve(),
  })
}
