// @flow

import { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getCurrentDevice } from 'reducers/devices'
import type { Device } from 'types/common'

const hookDeviceChangeInstances = []
let frozen = 0
export class FreezeDeviceChangeEvents extends PureComponent<{}> {
  componentDidMount() {
    frozen++
  }
  componentWillUnmount() {
    frozen--
    if (!frozen) {
      hookDeviceChangeInstances.forEach(i => i.onUnfreeze())
    }
  }
  render() {
    return null
  }
}

/* eslint-disable react/no-multi-comp */
class HookDeviceChange extends PureComponent<{
  device: ?Device,
  onDeviceDisconnected: () => void,
  onDeviceChanges: Device => void,
}> {
  componentDidMount() {
    const { device, onDeviceDisconnected } = this.props
    if (!device && !frozen) {
      onDeviceDisconnected()
    }
    hookDeviceChangeInstances.push(this)
  }
  componentDidUpdate(prevProps) {
    const { device, onDeviceDisconnected, onDeviceChanges } = this.props
    if (!device) {
      if (frozen) {
        this.onUnfreeze = onDeviceDisconnected
      } else {
        onDeviceDisconnected()
      }
    } else if (device !== prevProps.device) {
      if (frozen) {
        this.onUnfreeze = () => onDeviceChanges(device)
      } else {
        onDeviceChanges(device)
      }
    }
  }
  componentWillUnmount() {
    const i = hookDeviceChangeInstances.indexOf(this)
    if (i !== -1) hookDeviceChangeInstances.splice(i, 1)
  }
  onUnfreeze = () => {}
  render() {
    return null
  }
}

export default connect(
  createStructuredSelector({
    device: getCurrentDevice,
  }),
)(HookDeviceChange)
