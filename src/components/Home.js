import React, { Component } from 'react'
import { ipcRenderer } from 'electron'

class App extends Component {
  state = {
    devices: [],
  }

  componentDidMount() {
    ipcRenderer.send('listenDevices')

    ipcRenderer.on('addDevice', (e, device) =>
      this.setState(prev => ({
        devices: [...prev.devices, device].filter(
          (v, i, s) => s.findIndex(t => t.path === v.path) === i,
        ),
      })),
    )

    ipcRenderer.on('removeDevice', (e, device) =>
      this.setState(prev => ({
        devices: prev.devices.filter(d => d.path !== device.path),
      })),
    )
  }

  render() {
    const { devices } = this.state

    return <div>{devices.map(device => device.path)}</div>
  }
}

export default App
