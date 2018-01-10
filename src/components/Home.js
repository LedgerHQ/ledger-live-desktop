// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

import Box from 'components/base/Box'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  currentDevice: getCurrentDevice(state),
})

type Props = {
  currentDevice: Device,
}

class Home extends PureComponent<Props> {
  render() {
    const { currentDevice } = this.props
    return currentDevice !== null ? (
      <Box style={{ wordBreak: 'break-word' }} p={20}>
        Your current device: {currentDevice.path}
      </Box>
    ) : null
  }
}

export default connect(mapStateToProps)(Home)
