// @flow

import React, { Component } from 'react'
import CounterValues from 'helpers/countervalues'

class Effect extends Component<{ cvPolling: * }> {
  componentDidMount() {
    this.props.cvPolling.poll()
  }
  render() {
    return null
  }
}

const PollCounterValuesOnMount = () => (
  <CounterValues.PollingConsumer>
    {cvPolling => <Effect cvPolling={cvPolling} />}
  </CounterValues.PollingConsumer>
)

export default PollCounterValuesOnMount
