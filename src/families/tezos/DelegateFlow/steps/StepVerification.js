// @flow

import React, { PureComponent } from 'react'
import TrackPage from 'analytics/TrackPage'
import TransactionConfirm from 'components/TransactionConfirm'

import type { StepProps } from '../types'

export default class StepVerification extends PureComponent<StepProps> {
  componentDidMount() {
    this.signTransaction()
  }

  signTransaction = async () => {
    const { transitionTo } = this.props
    // TODO: not very good pattern to pass transitionTo... Stepper needs to be
    // controlled
    this.props.signTransaction({ transitionTo })
  }

  render() {
    const { device, account, parentAccount, transaction, status } = this.props
    if (!account || !device || !transaction) return null
    return (
      <>
        <TrackPage category="Send Flow" name="Step Verification" />
        <TransactionConfirm
          device={device}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          status={status}
        />
      </>
    )
  }
}
