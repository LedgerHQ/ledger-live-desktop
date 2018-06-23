// @flow

import React, { Component } from 'react'
import invariant from 'invariant'
import { connect } from 'react-redux'
import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import { createCancelablePolling } from 'helpers/promise'
import { standardDerivation } from 'helpers/derivations'
import { isSegwitAccount } from 'helpers/bip32'
import DeviceInteraction from 'components/DeviceInteraction'
import getAddress from 'commands/getAddress'
import IconUsb from 'icons/Usb'

import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'

const usbIcon = <IconUsb size={36} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

class EnsureDeviceAppInteraction extends Component<{
  device: ?Device,
  account?: ?Account,
  currency?: ?CryptoCurrency,
}> {
  connectInteractionHandler = () =>
    createCancelablePolling(500, () => {
      if (!this.props.device) return Promise.reject()
      return Promise.resolve(this.props.device)
    })

  openAppInteractionHandler = ({ device }) => {
    const { account, currency } = this.props
    return createCancelablePolling(500, async () => {
      const cur = account ? account.currency : currency
      invariant(cur, 'No currency given')
      const { address } = await getAddress
        .send({
          devicePath: device.path,
          currencyId: cur.id,
          path: account
            ? account.freshAddressPath
            : standardDerivation({ currency: cur, segwit: false, x: 0 }),
          segwit: account ? isSegwitAccount(account) : false,
        })
        .toPromise()
      return address
    })
  }

  renderOpenAppTitle = ({ device }) => {
    const { account, currency } = this.props
    const cur = account ? account.currency : currency
    invariant(cur, 'No currency given')
    return `Open the ${cur.name} app on your ${device ? `${device.product} ` : 'device'}`
  }

  render() {
    const { account, currency, ...props } = this.props
    const cur = account ? account.currency : currency
    const Icon = cur ? getCryptoCurrencyIcon(cur) : null
    return (
      <DeviceInteraction
        steps={[
          {
            id: 'device',
            title: 'Connect your device',
            icon: usbIcon,
            desc: 'Because it is required',
            minMs: 300,
            run: this.connectInteractionHandler,
          },
          {
            id: 'address',
            title: this.renderOpenAppTitle,
            desc: 'To be able to retriev your Bitcoins',
            icon: Icon ? <Icon size={24} /> : null,
            run: this.openAppInteractionHandler,
          },
        ]}
        {...props}
      />
    )
  }
}

export default connect(mapStateToProps)(EnsureDeviceAppInteraction)
