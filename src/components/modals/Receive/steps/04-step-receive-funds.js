// @flow

import invariant from 'invariant'
import React, { PureComponent } from 'react'

import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import CurrentAddressForAccount from 'components/CurrentAddressForAccount'
import RequestAmount from 'components/RequestAmount'

import type { StepProps } from '../index'

type State = {
  amount: number,
}

export default class StepReceiveFunds extends PureComponent<StepProps, State> {
  state = {
    amount: 0,
  }

  handleChangeAmount = (amount: number) => this.setState({ amount })
  handleGoPrev = () => {
    this.props.onChangeAppOpened(false)
    this.props.onResetSkip()
    this.props.transitionTo('device')
  }

  render() {
    const { t, account, isAddressVerified } = this.props
    const { amount } = this.state
    invariant(account, 'No account given')
    return (
      <Box flow={5}>
        <TrackPage category="Receive" name="Step4" />
        <Box flow={1}>
          <Label>{t('app:receive.steps.receiveFunds.label')}</Label>
          <RequestAmount
            account={account}
            onChange={this.handleChangeAmount}
            value={amount}
            withMax={false}
          />
        </Box>
        <CurrentAddressForAccount
          account={account}
          addressVerified={isAddressVerified === true}
          amount={amount}
          onVerify={this.handleGoPrev}
          withBadge
          withFooter
          withQRCode
          withVerify={isAddressVerified !== true}
        />
      </Box>
    )
  }
}

export function StepReceiveFundsFooter({ t, closeModal }: StepProps) {
  return (
    <Button primary onClick={closeModal}>
      {t('app:common.close')}
    </Button>
  )
}
