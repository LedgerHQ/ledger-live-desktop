// @flow
import { useEffect } from 'react'
import { connect } from 'react-redux'
import listenDevices from 'commands/listenDevices'
import { addDevice, removeDevice, resetDevices } from 'actions/devices'

const ListenDevices = ({ addDevice, removeDevice, resetDevices }) => {
  useEffect(() => {
    let sub
    let timeout
    function syncDevices() {
      const devices = {}
      sub = listenDevices.send().subscribe(
        ({ device, deviceModel, type }) => {
          if (device) {
            // when there are no more device after 5s debounce, we'll restart the listen
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              if (Object.keys(devices).length === 0) {
                sub.unsubscribe()
                syncDevices()
              }
            }, 5000)

            const stateDevice = {
              path: device.path,
              modelId: deviceModel ? deviceModel.id : 'nanoS',
              type: 'hid',
            }
            if (type === 'add') {
              devices[device.path] = true
              addDevice(stateDevice)
            } else if (type === 'remove') {
              delete devices[device.path]
              removeDevice(stateDevice)
            }
          }
        },
        () => {
          clearTimeout(timeout)
          resetDevices()
          syncDevices()
        },
        () => {
          clearTimeout(timeout)
          resetDevices()
          syncDevices()
        },
      )
    }
    syncDevices()

    return () => {
      clearTimeout(timeout)
      sub.unsubscribe()
    }
  }, [addDevice, removeDevice, resetDevices])
  return null
}

export default connect(
  null,
  { addDevice, removeDevice, resetDevices },
)(ListenDevices)
