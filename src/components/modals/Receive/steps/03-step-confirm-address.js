// @flow

import invariant from 'invariant'
import styled from 'styled-components'
import React, { Fragment, PureComponent } from 'react'

import getAddress from 'commands/getAddress'
import { isSegwitAccount } from 'helpers/bip32'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import DeviceConfirm from 'components/DeviceConfirm'
import CurrentAddressForAccount from 'components/CurrentAddressForAccount'
import { WrongDeviceForAccount } from 'components/EnsureDeviceApp'

import type { StepProps } from '../index'

export default class StepConfirmAddress extends PureComponent<StepProps> {
  componentDidMount() {
    this.confirmAddress()
  }

  confirmAddress = async () => {
    const { account, device, onChangeAddressVerified, transitionTo } = this.props
    invariant(account, 'No account given')
    invariant(device, 'No device given')
    try {
      const params = {
        currencyId: account.currency.id,
        devicePath: device.path,
        path: account.freshAddressPath,
        segwit: isSegwitAccount(account),
        verify: true,
      }
      const { address } = await getAddress.send(params).toPromise()

      if (address !== account.freshAddress) {
        throw new WrongDeviceForAccount(`WrongDeviceForAccount ${account.name}`, {
          accountName: account.name,
        })
      }
      onChangeAddressVerified(true)
      transitionTo('receive')
    } catch (err) {
      onChangeAddressVerified(false)
    }
  }

  render() {
    const { t, device, account, isAddressVerified } = this.props
    invariant(account, 'No account given')
    invariant(device, 'No device given')
    return (
      <Container>
        <TrackPage category="Receive" name="Step3" />
        {isAddressVerified === false ? (
          <Fragment>
            <Title>{t('app:receive.steps.confirmAddress.error.title')}</Title>
            <Text mb={5}>{t('app:receive.steps.confirmAddress.error.text')}</Text>
            <DeviceConfirm error />
          </Fragment>
        ) : (
          <Fragment>
            <Title>{t('app:receive.steps.confirmAddress.action')}</Title>
            <Text>{t('app:receive.steps.confirmAddress.text')}</Text>
            <CurrentAddressForAccount account={account} />
            <DeviceConfirm mb={2} mt={-1} error={isAddressVerified === false} />
          </Fragment>
        )}
      </Container>
    )
  }
}

export function StepConfirmAddressFooter({ t }: StepProps) {
  // This will be displayed only if user rejected address
  return <Button>{t('app:receive.steps.confirmAddress.support')}</Button>
}

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
