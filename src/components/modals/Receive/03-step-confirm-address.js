// @flow

import React from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { Device, T } from 'types/common'

import Box from 'components/base/Box'
import CurrentAddress from 'components/CurrentAddress'
import DeviceConfirm from 'components/DeviceConfirm'
import DeviceCheckAddress from 'components/DeviceCheckAddress'

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

const Text = styled(Box).attrs({
  color: 'smoke',
})`
  text-align: center;
`

type Props = {
  account: Account | null,
  addressVerified: null | boolean,
  device: Device | null,
  onCheck: Function,
  t: T,
}

export default (props: Props) => (
  <Container>
    <Title>{props.t('receive:steps.confirmAddress.action')}</Title>
    <Text>{props.t('receive:steps.confirmAddress.text')}</Text>
    {props.account && (
      <CurrentAddress addressVerified={props.addressVerified} address={props.account.address} />
    )}
    {props.device &&
      props.account && (
        <Box mb={2}>
          <DeviceCheckAddress
            account={props.account}
            device={props.device}
            onCheck={props.onCheck}
            render={({ isVerified }) => <DeviceConfirm notValid={isVerified === false} />}
          />
        </Box>
      )}
  </Container>
)
