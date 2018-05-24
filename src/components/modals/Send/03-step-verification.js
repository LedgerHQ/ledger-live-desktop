// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import WarnBox from 'components/WarnBox'
import { multiline } from 'styles/helpers'
import DeviceSignTransaction from 'components/DeviceSignTransaction'
import DeviceConfirm from 'components/DeviceConfirm'

import type { WalletBridge } from 'bridge/types'
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
  bridge: ?WalletBridge<*>,
  transaction: *,
  onValidate: Function,
  t: T,
}

export default ({ account, device, bridge, transaction, onValidate, t }: Props) => (
  <Container>
    <WarnBox>{multiline(t('send:steps.verification.warning'))}</WarnBox>
    <Info>{t('send:steps.verification.body')}</Info>
    {account &&
      bridge &&
      transaction &&
      device && (
        <DeviceSignTransaction
          account={account}
          device={device}
          transaction={transaction}
          bridge={bridge}
          onSuccess={onValidate}
          render={({ error }) => (
            // FIXME we really really REALLY should use error for the display. otherwise we are completely blind on error cases..
            <DeviceConfirm notValid={!!error} />
          )}
        />
      )}
  </Container>
)
