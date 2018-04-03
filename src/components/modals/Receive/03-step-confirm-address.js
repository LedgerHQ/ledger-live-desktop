// @flow

import React from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { T } from 'types/common'

import Box from 'components/base/Box'

import IconInfoCircle from 'icons/InfoCircle'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 6,
  mb: 1,
})``

const Address = styled(Box).attrs({
  bg: 'lightGrey',
  ff: 'Open Sans|SemiBold',
  px: 4,
  py: 3,
  borderRadius: 1,
  mt: 2,
})`
  border: 1px dashed ${p => p.theme.colors.fog};
  cursor: text;
  user-select: text;
`

const Text = styled(Box).attrs({
  color: 'smoke',
  mb: 5,
})`
  text-align: center;
`

const Label = styled(Box).attrs({
  alignItems: 'center',
  color: 'graphite',
  ff: 'Open Sans|SemiBold',
  flow: 1,
  horizontal: true,
})``

type Props = {
  account: Account,
  t: T,
}

export default (props: Props) => (
  <Container>
    <Title>{props.t('receive:steps.confirmAddress.action')}</Title>
    <Text>{props.t('receive:steps.confirmAddress.text')}</Text>
    <Label>
      <Box>{props.t('receive:steps.confirmAddress.label')}</Box>
      <IconInfoCircle size={12} />
    </Label>
    <Address>{props.account.address}</Address>
  </Container>
)
