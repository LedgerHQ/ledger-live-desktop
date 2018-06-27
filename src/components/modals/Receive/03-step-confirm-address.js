// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device, T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import CurrentAddressForAccount from 'components/CurrentAddressForAccount'
import DeviceConfirm from 'components/DeviceConfirm'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
  px: 7,
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
  account: ?Account,
  addressVerified: ?boolean,
  device: ?Device,
  t: T,
}

export default (props: Props) => (
  <Container>
    <TrackPage category="Receive" name="Step3" />
    {props.addressVerified === false ? (
      <Fragment>
        <Title>{props.t('app:receive.steps.confirmAddress.error.title')}</Title>
        <Text mb={5}>{props.t('app:receive.steps.confirmAddress.error.text')}</Text>
        <DeviceConfirm error />
      </Fragment>
    ) : (
      <Fragment>
        <Title>{props.t('app:receive.steps.confirmAddress.action')}</Title>
        <Text>{props.t('app:receive.steps.confirmAddress.text')}</Text>
        {props.account && <CurrentAddressForAccount account={props.account} />}
        {props.device &&
          props.account && <DeviceConfirm mb={2} mt={-1} error={props.addressVerified === false} />}
      </Fragment>
    )}
  </Container>
)
