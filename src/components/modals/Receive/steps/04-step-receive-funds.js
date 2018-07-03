// @flow

import invariant from 'invariant'
import React, { PureComponent } from 'react'

import TrackPage from 'analytics/TrackPage'
import getAddress from 'commands/getAddress'
import { isSegwitAccount } from 'helpers/bip32'
import Box from 'components/base/Box'
import CurrentAddressForAccount from 'components/CurrentAddressForAccount'
import { WrongDeviceForAccount } from 'components/EnsureDeviceApp'

import type { StepProps } from '..'

export default class StepReceiveFunds extends PureComponent<StepProps> {
  componentDidMount() {
    if (this.props.isAddressVerified === null) {
      this.confirmAddress()
    }
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
      onChangeAddressVerified(false, err)
      this.props.transitionTo('confirm')
    }
  }

  handleGoPrev = () => {
    // FIXME this is not a good practice at all. it triggers tons of setState. these are even concurrent setState potentially in future React :o
    this.props.onChangeAddressVerified(null)
    this.props.onChangeAppOpened(false)
    this.props.onResetSkip()
    this.props.transitionTo('device')
  }

  render() {
    const { account, isAddressVerified } = this.props
    invariant(account, 'No account given')
    return (
      <Box flow={5}>
        <TrackPage category="Receive" name="Step4" />
        <CurrentAddressForAccount
          account={account}
          isAddressVerified={isAddressVerified}
          onVerify={this.handleGoPrev}
          withBadge
          withFooter
          withQRCode
        />
      </Box>
    )
  }
}
