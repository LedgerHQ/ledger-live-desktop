// @flow
/* eslint-disable react/no-multi-comp */

import { Component, PureComponent } from 'react'
import { connect } from 'react-redux'

import type { Node } from 'react'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

type Props = {
  device: Device,
  children: (device: Device) => Node,
}

let prevents = 0
export class PreventDeviceChangeRecheck extends PureComponent<{}> {
  componentDidMount() {
    prevents++
  }
  componentWillUnmount() {
    prevents--
  }
  render() {
    return null
  }
}

class EnsureDevice extends Component<Props> {
  shouldComponentUpdate(nextProps) {
    if (prevents > 0) return false
    return nextProps.device !== this.props.device
  }
  render() {
    const { device, children } = this.props
    return children(device)
  }
}

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

export default connect(mapStateToProps)(EnsureDevice)
