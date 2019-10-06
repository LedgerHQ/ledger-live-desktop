// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { multiline } from 'styles/helpers'

import TrackPage from 'analytics/TrackPage'
import { urls } from 'config/urls'
import { openURL } from 'helpers/linking'
import Box from 'components/base/Box'
import LinkWithExternalIcon from 'components/base/LinkWithExternalIcon'
import WarnBox from 'components/WarnBox'
import Interactions from 'icons/device/interactions'

import type { StepProps } from '../types'

const Container = styled(Box).attrs(() => ({ alignItems: 'center', fontSize: 4, pb: 4 }))``
const Info = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  color: 'palette.text.shade100',
  mt: 6,
  mb: 4,
  px: 5,
}))`
  text-align: center;
`

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
    const { t, device } = this.props
    const isBlue = device && device.modelId === 'blue'

    return (
      <Container>
        <TrackPage category="Send Flow" name="Step 3" />
        <WarnBox>
          {multiline(t('send.steps.verification.warning'))}
          <LinkWithExternalIcon
            onClick={() => openURL(urls.recipientAddressInfo)}
            label={t('common.learnMore')}
          />
        </WarnBox>
        <Info>{t('send.steps.verification.body')}</Info>
        {!device ? null : (
          <Box mt={isBlue ? 4 : null}>
            <Interactions
              screen="validation"
              action="accept"
              type={device.modelId}
              width={isBlue ? 120 : 375}
              wire="wired"
            />
          </Box>
        )}
      </Container>
    )
  }
}
