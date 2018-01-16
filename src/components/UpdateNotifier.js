// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { MapStateToProps } from 'react-redux'
import styled from 'styled-components'

import { getUpdateStatus } from 'reducers/update'
import type { State } from 'reducers'
import type { UpdateStatus } from 'reducers/update'

type Props = {
  updateStatus: UpdateStatus,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: State) => ({
  updateStatus: getUpdateStatus(state),
})

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`

class UpdateNotifier extends PureComponent<Props> {
  render() {
    const { updateStatus } = this.props
    return <Container>{updateStatus}</Container>
  }
}

export default connect(mapStateToProps, null)(UpdateNotifier)
