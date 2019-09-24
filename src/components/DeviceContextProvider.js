// @flow
import React, { useEffect, useContext, useReducer, useCallback } from 'react'
import invariant from 'invariant'
import { connect } from 'react-redux'
import listenDevices from 'commands/listenDevices'
import getAppAndVersion from 'commands/getAppAndVersion'

const DeviceContext = React.createContext({})

export const useDevice = () => useContext(DeviceContext)
type Props = { children: any }

const DeviceContextProvider = ({ children }: Props) => {
  useEffect(() => {
    let sub
    let timeout
    let removeTimeout

    function syncDevices() {
      const devices = {}
      sub = listenDevices.send().subscribe(
        async ({ device, deviceModel, type }) => {
          if (device) {
            // when there are no more device after 2s debounce, we'll restart the listen
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              if (Object.keys(devices).length === 0) {
                sub.unsubscribe()
                syncDevices()
              }
            }, 2000)

            const stateDevice = {
              path: device.path,
              modelId: deviceModel ? deviceModel.id : 'nanoS',
              type: 'hid',
            }

            if (type === 'add') {
              devices[device.path] = true
              clearTimeout(removeTimeout)

              const app = await getAppAndVersion.send({ devicePath: device.path }).toPromise()
              dispatch({ type: 'ADD_DEVICE', payload: { device: { ...stateDevice }, app } })
            } else if (type === 'remove') {
              delete devices[device.path]
              dispatch({ type: 'MAYBE_CONNECTED', payload: { maybeConnected: true } })
              removeTimeout = setTimeout(() => {
                dispatch({ type: 'REMOVE_DEVICE' })
              }, 2000)
            }
          }
        },
        () => {
          clearTimeout(timeout)
          dispatch({ type: 'REMOVE_DEVICE' }) // TODO do we need this?
          syncDevices()
        },
        () => {
          clearTimeout(timeout)
          dispatch({ type: 'REMOVE_DEVICE' })
          syncDevices()
        },
      )
    }
    syncDevices()

    return () => {
      clearTimeout(timeout)
      sub.unsubscribe()
    }
  }, [])

  const [state, dispatch] = useReducer(reducer, { device: null, locked: true })

  const lockDevice = useCallback(() => {
    if (state.locked) {
      return false
    }
    dispatch({ type: 'LOCK' })
    return true
  }, [state])

  const unlockDevice = useCallback(() => dispatch({ type: 'UNLOCK' }), [])

  const getDevice = useCallback(() => dispatch({ type: 'GET_DEVICE' }), [])

  return (
    <DeviceContext.Provider value={[state, { lockDevice, unlockDevice, getDevice }]}>
      {children}
    </DeviceContext.Provider>
  )
}

function reducer(state, action) {
  const actions = ['LOCK', 'UNLOCK', 'MAYBE_CONNECTED', 'ADD_DEVICE', 'REMOVE_DEVICE', 'GET_DEVICE']
  invariant(actions.includes(action.type), `Unknown DeviceContext action received : ${action.type}`)

  switch (action.type) {
    case 'LOCK':
      return { ...state, locked: true }
    case 'UNLOCK':
      return { ...state, locked: false }
    case 'MAYBE_CONNECTED':
      return { ...state, maybeConnected: true }
    case 'ADD_DEVICE': {
      return { ...state, maybeConnected: false, ...action.payload }
    }
    case 'REMOVE_DEVICE':
      return { ...state, maybeConnected: false, device: null }
    case 'GET_DEVICE':
      if (state.locked) {
        return null
      } else {
        return state.device
      }
    default:
      return state
  }
}
export default connect(null)(DeviceContextProvider)
