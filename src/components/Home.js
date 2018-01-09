// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import { devicesUpdate, deviceAdd, deviceRemove } from 'actions/devices'

type Props = {
  devicesUpdate: (devices: Object) => void,
  deviceAdd: (device: Object) => void,
  deviceRemove: (device: Object) => void,
  devices: Object,
}

class Home extends PureComponent<Props> {
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
    const { devices } = this.props

    return <div>{devices.map(device => device.path)}</div>
  }
}

export default connect(({ devices }) => ({ devices }), {
  deviceAdd,
  deviceRemove,
  devicesUpdate,
})(Home)
