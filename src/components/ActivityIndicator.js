// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import { globalSyncStateSelector } from 'reducers/bridgeSync'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import CounterValues from 'helpers/countervalues'
import IconActivity from 'icons/Activity'
import Box from './base/Box'

const Activity = styled.div`
  background: ${p =>
    p.pending
      ? p.theme.colors.wallet
      : p.error
        ? p.theme.colors.alertRed
        : p.theme.colors.positiveGreen};
  border-radius: 50%;
  bottom: 20px;
  height: 4px;
  position: absolute;
  right: -2px;
  width: 4px;
  cursor: pointer;
`

const mapStateToProps = createStructuredSelector({ globalSyncState: globalSyncStateSelector })

class ActivityIndicatorUI extends Component<*> {
  render() {
    const { pending, error, onClick } = this.props
    return (
      <Box justifyContent="center" relative cursor="pointer" onClick={onClick}>
        <IconActivity size={16} />
        <Activity pending={pending} error={error} />
      </Box>
    )
  }
}

const ActivityIndicator = ({ globalSyncState }: *) => (
  <BridgeSyncConsumer>
    {bridgeSync => (
      <CounterValues.PollingConsumer>
        {cvPolling => (
          <ActivityIndicatorUI
            onClick={() => {
              cvPolling.poll()
              bridgeSync.syncAll()
            }}
            pending={cvPolling.pending || globalSyncState.pending}
            error={cvPolling.error || globalSyncState.error}
          />
        )}
      </CounterValues.PollingConsumer>
    )}
  </BridgeSyncConsumer>
)

export default connect(mapStateToProps)(ActivityIndicator)
