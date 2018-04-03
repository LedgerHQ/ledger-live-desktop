import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'renderer/createStore'

export default function withStore(state, component) {
  const store = createStore({ state })
  return <Provider store={store}>{component}</Provider>
}
