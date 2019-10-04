// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account/helpers'
import TrackPage from 'analytics/TrackPage'
import { urls } from 'config/urls'
import { openURL } from 'helpers/linking'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
import RetryButton from 'components/base/RetryButton'
import LinkWithExternalIcon from 'components/base/LinkWithExternalIcon'
import Interactions from 'icons/device/interactions'

import type { StepProps } from '../index'
import TranslatedError from '../../../TranslatedError'
import DebugAppInfosForCurrency from '../../../DebugAppInfosForCurrency'

export default class StepConfirmAddress extends PureComponent<StepProps> {
  render() {
    const { t, account, isAddressVerified, verifyAddressError, transitionTo, device } = this.props
    const isBlue = device && device.modelId === 'blue'
    const currency = account ? getAccountCurrency(account) : null

    return (
      <Container>
        <TrackPage category="Receive Flow" name="Step 3" />
        {isAddressVerified === false ? (
          <>
            {account ? <DebugAppInfosForCurrency /> : null}
            <TrackPage category="Receive Flow" name="Step 3 Address Not Verified Error" />
            <Title>
              <TranslatedError error={verifyAddressError} />
            </Title>
            <Text mb={5}>
              <TranslatedError error={verifyAddressError} field="description" />
            </Text>
            {!device ? null : (
              <Box pt={isBlue ? 2 : null}>
                <Interactions
                  type={device.modelId}
                  error={verifyAddressError}
                  width={isBlue ? 120 : 375}
                  wire="wired"
                />
              </Box>
            )}
          </>
        ) : (
          <>
            <Title>{t('receive.steps.confirmAddress.action')}</Title>
            <Text>
              {currency
                ? t('receive.steps.confirmAddress.text', { currencyName: currency.name })
                : null}
            </Text>
            <LinkWithExternalIcon
              onClick={() => openURL(urls.recipientAddressInfo)}
              label={t('common.learnMore')}
            />
            <Button mt={4} mb={2} primary onClick={() => transitionTo('receive')}>
              {t('common.continue')}
            </Button>
            {!device ? null : (
              <Box pt={isBlue ? 4 : null}>
                <Interactions
                  type={device.modelId}
                  screen="validation"
                  error={verifyAddressError}
                  width={isBlue ? 120 : 375}
                  wire="wired"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    )
  }
}

export function StepConfirmAddressFooter({ t, transitionTo, onRetry }: StepProps) {
  // This will be displayed only if user rejected address
  return (
    <>
      <ExternalLinkButton
        event="Receive Flow Step 3 Contact Us Clicked"
        label={t('receive.steps.confirmAddress.support')}
        url={urls.contactSupport}
      />
      <RetryButton
        ml={2}
        primary
        event="Receive Flow Step 3 Retry Clicked"
        onClick={() => {
          onRetry()
          transitionTo('device')
        }}
      />
    </>
  )
}

const Container = styled(Box).attrs(() => ({
  alignItems: 'center',
  fontSize: 4,
  color: 'palette.text.shade100',
  px: 5,
  mb: 2,
}))``

const Title = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 6,
  mb: 1,
}))``

const Text = styled(Box).attrs(() => ({
  color: 'palette.text.shade80',
}))`
  text-align: center;
`
