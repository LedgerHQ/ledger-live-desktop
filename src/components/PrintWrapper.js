// @flow

import React, { PureComponent } from 'react'
import { remote } from 'electron'
import queryString from 'query-string'

import QRCode from 'components/base/QRCode'
import Box from 'components/base/Box'
import { AddressBox } from 'components/ReceiveBox'

type State = {
  data: Object | null,
}

class PrintWrapper extends PureComponent<any, State> {
  state = {
    data: null,
  }

  componentWillMount() {
    this.setState({
      data: queryString.parse(this.props.location.search),
    })
  }

  componentDidMount() {
    window.requestAnimationFrame(() =>
      setTimeout(() => {
        // hacky way to detect that render is ready
        // from the parent window
        remote.getCurrentWindow().minimize()
      }, 300),
    )
  }

  render() {
    const { data } = this.state
    if (!data) {
      return null
    }
    const { address, amount } = data
    return (
      <Box p={3} flow={3}>
        <QRCode size={150} data={`bitcoin:${address}${amount ? `?amount=${amount}` : ''}`} />
        <AddressBox>{address}</AddressBox>
        {amount && <AddressBox>{amount}</AddressBox>}
      </Box>
    )
  }
}

export default PrintWrapper
