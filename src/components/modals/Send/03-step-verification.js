// @flow

import React from 'react'
import styled from 'styled-components'
import uniqueId from 'lodash/uniqueId'

import Box from 'components/base/Box'
import WarnBox from 'components/WarnBox'
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

export default (props: Props) => (
  <Container>
    <WarnBox>
      {props
        .t('send:steps.verification.warning')
        .split('\n')
        .map(line => <p key={uniqueId()}>{line}</p>)}
    </WarnBox>
    <Info>{props.t('send:steps.verification.body')}</Info>
    <DeviceConfirm />
  </Container>
)
