// @flow
import logger from 'logger'
import { throwError } from 'rxjs'
import { registerTransportModule } from '@ledgerhq/live-common/lib/hw'
import { addAccessHook, setErrorRemapping } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import throttle from 'lodash/throttle'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { DisconnectedDevice } from '@ledgerhq/live-common/lib/errors'
import { retry } from './promise'

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

registerTransportModule({
  id: 'hid',
  open: async devicePath => {
    const t = await retry(() => TransportNodeHid.open(devicePath), { maxRetry: 2 })
    t.setDebugMode(logger.apdu)
    return t
  },
  disconnect: () => Promise.resolve(),
})
