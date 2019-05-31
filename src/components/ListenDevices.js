// @flow
import { useEffect } from 'react'
import { connect } from 'react-redux'
import listenDevices from 'commands/listenDevices'
import appAndVersionPolling from 'commands/appAndVersionPolling'
import { addDevice, removeDevice, resetDevices } from 'actions/devices'
import useEnv from 'hooks/useEnv'
import logger from 'logger'

const ListenDevices = ({ addDevice, removeDevice, resetDevices }) => {
  const experimentalUSB = useEnv('EXPERIMENTAL_USB')
  useEffect(
    () => {
      if (experimentalUSB) {
        let sub
        const syncDevices = () => {
          sub = appAndVersionPolling.send().subscribe(
            e => {
              if (e.connected) {
                addDevice({
                  path: '',
                  modelId: e.deviceModelId || 'nanoS',
                  appName: e.name,
                  version: e.version,
                })
              } else {
                resetDevices()
              }
            },
            e => {
              logger.error(e)
              syncDevices()
            },
            () => syncDevices(),
          )
        }

        syncDevices()
        return () => sub.unsubscribe()
      }

      // STABLE implementation (legacy?)

      let sub
      const syncDevices = () => {
        sub = listenDevices.send().subscribe(
          ({ device, deviceModel, type }) => {
            if (device) {
              const stateDevice = {
                path: device.path,
                modelId: deviceModel ? deviceModel.id : 'nanoS',
                type: 'hid',
              }
              if (type === 'add') {
                addDevice(stateDevice)
              } else if (type === 'remove') {
                removeDevice(stateDevice)
              }
            }
          },
          () => {
            resetDevices()
            syncDevices()
          },
          () => {
            resetDevices()
            syncDevices()
          },
        )
      }
      syncDevices()

      return () => sub.unsubscribe()
    },
    [experimentalUSB],
  )
  return null
}

export default connect(
  null,
  { addDevice, removeDevice, resetDevices },
)(ListenDevices)
