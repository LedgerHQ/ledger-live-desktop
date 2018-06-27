import React, { Component, Fragment } from 'react'
import TrackPage from 'analytics/TrackPage'
import StepConnectDevice from '../StepConnectDevice'

class SendStepConnectDevice extends Component<*> {
  render() {
    return (
      <Fragment>
        <TrackPage category="Send" name="Step2" />
        <StepConnectDevice {...this.props} />
      </Fragment>
    )
  }
}

export default SendStepConnectDevice
