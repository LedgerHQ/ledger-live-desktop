// @flow

import React from 'react'
import styled from 'styled-components'

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
  hasError: boolean,
  t: T,
}

export default ({ t, hasError }: Props) => (
  <Container>
    <WarnBox>{multiline(t('app:send.steps.verification.warning'))}</WarnBox>
    <Info>{t('app:send.steps.verification.body')}</Info>
    <DeviceConfirm error={hasError} />
  </Container>
)
