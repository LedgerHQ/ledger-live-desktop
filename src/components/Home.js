// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

type Props = {
  devices: Array<Object>,
}

class Home extends PureComponent<Props> {
  render() {
    const { devices } = this.props

    return <div>{devices.map(device => device.path)}</div>
  }
}

export default connect(({ devices }: Props): Object => ({ devices }))(Home)
