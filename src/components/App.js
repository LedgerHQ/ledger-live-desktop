// @flow

import React, { PureComponent } from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import { Route } from 'react-router'
import { ipcRenderer } from 'electron'

import { devicesUpdate, deviceAdd, deviceRemove } from 'actions/devices'

import theme from 'styles/theme'

import Box from 'components/base/Box'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'
import Home from 'components/Home'

type Props = {
  deviceAdd: (device: Object) => void,
  deviceRemove: (device: Object) => void,
  devicesUpdate: (devices: Object) => void,
  history: Object,
  store: Object,
}

class App extends PureComponent<Props> {
  componentWillMount() {
    const { devicesUpdate, deviceAdd, deviceRemove } = this.props

    ipcRenderer.on('updateDevices', (e, devices) => devicesUpdate(devices))
    ipcRenderer.on('addDevice', (e, device) => deviceAdd(device))
    ipcRenderer.on('removeDevice', (e, device) => deviceRemove(device))

    // First renderer, we get all devices
    ipcRenderer.send('getDevices')

    // Start detection when we plug/unplug devices
    ipcRenderer.send('listenDevices')
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('updateDevices')
    ipcRenderer.removeAllListeners('addDevice')
    ipcRenderer.removeAllListeners('removeDevice')
  }

  render() {
    const { history, store } = this.props

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <Box grow horizontal>
              <SideBar />
              <Box grow bg="cream">
                <TopBar />
                <Route path="/" component={Home} />
              </Box>
            </Box>
          </ConnectedRouter>
        </ThemeProvider>
      </Provider>
    )
  }
}

export default connect(null, {
  deviceAdd,
  deviceRemove,
  devicesUpdate,
})(App)
