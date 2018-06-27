import React, { Component, Fragment } from 'react'
import TrackPage from 'analytics/TrackPage'
import StepConnectDevice from '../StepConnectDevice'

class ReceiveStepConnectDevice extends Component<*> {
  render() {
    return (
      <Fragment>
        <TrackPage category="Receive" name="Step2" />
        <StepConnectDevice {...this.props} />
      </Fragment>
    )
  }
}

export default ReceiveStepConnectDevice
