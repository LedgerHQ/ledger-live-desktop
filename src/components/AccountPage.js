// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Account } from 'types/common'

import { getAccountById } from 'reducers/accounts'

import Box from 'components/base/Box'

type Props = {
  account: Account,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
})

class AccountPage extends PureComponent<Props> {
  render() {
    const { account } = this.props

    return (
      <Box>
        <Box>{'account page'}</Box>
        <Box>
          {account.name} - {account.address}
        </Box>
      </Box>
    )
  }
}

export default connect(mapStateToProps)(AccountPage)
