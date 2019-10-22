import { useState, useEffect } from 'react'

export const useDeviceFlow = ({ flowProps, defaultProps, loop = false }, initialState) => {
  const [deviceState, setDeviceState] = useState({ index: 0, props: initialState })

  useEffect(() => {
    setDeviceState({ index: 0, props: defaultProps })
  }, [defaultProps])

  useEffect(() => {
    const nextState = flowProps[deviceState.index]
    let timeoutInstance
    if (nextState) {
      timeoutInstance = setTimeout(() => {
        setDeviceState(state => ({
          index: loop ? (state.index + 1) % flowProps.length : state.index + 1,
          props: {
            ...state.props,
            ...nextState.props,
          },
        }))
      }, nextState.timeout)
    }
    return () => {
      if (timeoutInstance) {
        clearTimeout(timeoutInstance)
      }
    }
  }, [deviceState, defaultProps, flowProps, loop])
  return deviceState.props
}
