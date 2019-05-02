// @flow

import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { colors } from 'styles/theme'

import IconCheck from 'icons/Check'
import IconLoader from 'icons/Loader'
import IconPending from 'icons/Clock'
import IconError from 'icons/Error'

import { isUpToDateAccountSelector } from '../../reducers/accounts'
import { accountSyncStateSelector } from '../../reducers/bridgeSync'
import { Rotating } from '../base/Spinner'

const mapStateToProps = createStructuredSelector({
  syncState: accountSyncStateSelector,
  isUpToDateAccount: isUpToDateAccountSelector,
})

class AccountSyncStatusIndicator extends Component<{
  isUpToDateAccount: boolean,
  syncState: *,
}> {
  render() {
    const { pending, error } = this.props.syncState
    const { isUpToDateAccount } = this.props

    if (pending && !isUpToDateAccount) return <IconPending color={colors.grey} size={16} />
    if (error) return <IconError color={colors.alertRed} size={16} />
    if (isUpToDateAccount) return <IconCheck color={colors.positiveGreen} size={16} />
    return (
      <Rotating size={16}>
        <IconLoader color={colors.grey} size={16} />
      </Rotating>
    )
  }
}

export default connect(mapStateToProps)(AccountSyncStatusIndicator)
