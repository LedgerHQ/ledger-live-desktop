// @flow

import React, { PureComponent } from 'react'
import { Motion, spring } from 'react-motion'
import { connect } from 'react-redux'
import type { MapStateToProps } from 'react-redux'
import styled from 'styled-components'

import { getUpdateStatus, getUpdateData } from 'reducers/update'
import { sendEvent } from 'renderer/events'
import type { State } from 'reducers'
import type { UpdateStatus } from 'reducers/update'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

type Props = {
  updateStatus: UpdateStatus,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: State) => ({
  updateStatus: getUpdateStatus(state),
  updateData: getUpdateData(state),
})

const Container = styled(Box).attrs({
  p: 1,
  bg: 'blue',
  color: 'white',
  style: p => ({
    transform: `translate3d(0, ${p.offset}%, 0)`,
  }),
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`

class UpdateNotifier extends PureComponent<Props> {
  renderStatus() {
    const { updateStatus } = this.props
    switch (updateStatus) {
      case 'idle':
      case 'checking':
      case 'unavailable':
      case 'error':
      case 'available':
      case 'progress':
        return null
      case 'downloaded':
        return (
          <Box horizontal flow={2}>
            <Text fontWeight="bold">{'A new version is ready to be installed.'}</Text>
            <Text
              style={{ cursor: 'pointer' }}
              onClick={() => sendEvent('msg', 'updater.quitAndInstall')}
            >
              {'Re-launch app now'}
            </Text>
          </Box>
        )
      default:
        return null
    }
  }

  render() {
    const { updateStatus } = this.props
    const isToggled = updateStatus === 'downloaded'
    return (
      <Motion
        style={{
          offset: spring(isToggled ? 0 : -100),
        }}
      >
        {m => <Container offset={m.offset}>{this.renderStatus()}</Container>}
      </Motion>
    )
  }
}

export default connect(mapStateToProps, null)(UpdateNotifier)
