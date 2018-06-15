// @flow
import { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { Node } from 'react'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

type Props = {
  device: Device,
  children: (device: Device) => Node,
}

type State = {}

class EnsureDevice extends PureComponent<Props, State> {
  render() {
    const { device, children } = this.props
    return children(device)
  }
}

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

export default connect(mapStateToProps)(EnsureDevice)
