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
import DeviceConfirm from 'components/DeviceConfirm'
import NanoXStates from 'components/NanoXStates'

import type { StepProps } from '../index'

const Container = styled(Box).attrs({ alignItems: 'center', fontSize: 4, pb: 4 })``
const Info = styled(Box).attrs({ ff: 'Open Sans|SemiBold', color: 'dark', mt: 6, mb: 4, px: 5 })`
  text-align: center;
`

export default class StepVerification extends PureComponent<StepProps<*>> {
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
        {device ? (
          device.modelId === 'nanoX' ? (
            <NanoXStates validate />
          ) : (
            <DeviceConfirm deviceModelId={device.modelId} />
          )
        ) : null}
      </Container>
    )
  }
}
