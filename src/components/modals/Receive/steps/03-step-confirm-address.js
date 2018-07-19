// @flow

import invariant from 'invariant'
import styled from 'styled-components'
import React, { Fragment, PureComponent } from 'react'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import DeviceConfirm from 'components/DeviceConfirm'
import type { StepProps } from '../index'
import TranslatedError from '../../../TranslatedError'

export default class StepConfirmAddress extends PureComponent<StepProps> {
  render() {
    const { t, device, account, isAddressVerified, verifyAddressError, transitionTo } = this.props
    invariant(account, 'No account given')
    invariant(device, 'No device given')
    return (
      <Container>
        <TrackPage category="Receive Flow" name="Step 3" />
        {isAddressVerified === false ? (
          <Fragment>
            <TrackPage category="Receive Flow" name="Step 3 Address Not Verified Error" />
            <Title>
              <TranslatedError error={verifyAddressError} />
            </Title>
            <Text mb={5}>
              <TranslatedError error={verifyAddressError} field="description" />
            </Text>
            <DeviceConfirm error />
          </Fragment>
        ) : (
          <Fragment>
            <Title>{t('app:receive.steps.confirmAddress.action')}</Title>
            <Text>
              {t('app:receive.steps.confirmAddress.text', { currencyName: account.currency.name })}
            </Text>
            <Button mt={4} mb={2} primary onClick={() => transitionTo('receive')}>
              {t('app:common.verify')}
            </Button>
            <DeviceConfirm withoutPushDisplay error={isAddressVerified === false} />
          </Fragment>
        )}
      </Container>
    )
  }
}

export function StepConfirmAddressFooter({ t, transitionTo, onRetry, contactUs }: StepProps) {
  // This will be displayed only if user rejected address
  return (
    <Fragment>
      <Button onClick={contactUs} event="Receive Flow Step 3 Contact Us Clicked">
        {t('app:receive.steps.confirmAddress.support')}
      </Button>
      <Button
        ml={2}
        primary
        event="Receive Flow Step 3 Retry Clicked"
        onClick={() => {
          onRetry()
          transitionTo('device')
        }}
      >
        {t('app:common.retry')}
      </Button>
    </Fragment>
  )
}

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
  px: 5,
  mb: 2,
})``

const Title = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 6,
  mb: 1,
})``

const Text = styled(Box).attrs({
  color: 'smoke',
})`
  text-align: center;
`
