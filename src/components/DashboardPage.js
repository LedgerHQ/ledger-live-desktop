// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'

import { format } from 'helpers/btc'

import { getTotalBalance } from 'reducers/accounts'

import Box from 'components/base/Box'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  totalBalance: getTotalBalance(state),
})

type Props = {
  totalBalance: number,
}

class DashboardPage extends PureComponent<Props> {
  render() {
    const { totalBalance } = this.props
    return <Box p={20}>Your balance: {format(totalBalance)}</Box>
  }
}

export default connect(mapStateToProps)(DashboardPage)
