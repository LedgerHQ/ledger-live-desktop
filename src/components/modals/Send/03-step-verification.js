// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import WarnBox from 'components/WarnBox'
import { multiline } from 'styles/helpers'
import DeviceCheckAddress from 'components/DeviceCheckAddress'
import DeviceConfirm from 'components/DeviceConfirm'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device, T } from 'types/common'

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
  account: ?Account,
  device: ?Device,
  onValidate: Function,
  t: T,
}

export default (props: Props) => (
  <Container>
    <WarnBox>{multiline(props.t('send:steps.verification.warning'))}</WarnBox>
    <Info>{props.t('send:steps.verification.body')}</Info>
    {// TODO: Actually create a tx
    // DeviceCheckAddress used as a placeholder in the meantime
    props.account &&
      props.device && (
        <DeviceCheckAddress
          account={props.account}
          device={props.device}
          onCheck={props.onValidate}
          render={({ isVerified }) => <DeviceConfirm notValid={isVerified === false} />}
        />
      )}
  </Container>
)
