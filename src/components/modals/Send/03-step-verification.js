// @flow

import React from 'react'
import styled from 'styled-components'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import WarnBox from 'components/WarnBox'
import { multiline } from 'styles/helpers'
import DeviceConfirm from 'components/DeviceConfirm'

import type { T } from 'types/common'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  pb: 4,
})``

const Info = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  color: 'dark',
  mt: 6,
  mb: 4,
  px: 5,
})`
  text-align: center;
`

type Props = {
  t: T,
}

export default ({ t }: Props) => (
  <Container>
    <TrackPage category="Send" name="Step3" />
    <WarnBox>{multiline(t('app:send.steps.verification.warning'))}</WarnBox>
    <Info>{t('app:send.steps.verification.body')}</Info>
    <DeviceConfirm />
  </Container>
)
