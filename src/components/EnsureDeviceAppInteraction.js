// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
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
  account: Account,
}> {
  render() {
    const { account, ...props } = this.props
    const Icon = getCryptoCurrencyIcon(account.currency)
    return (
      <DeviceInteraction
        steps={[
          {
            id: 'device',
            title: 'Connect your device',
            icon: usbIcon,
            desc: 'Because it is required',
            minMs: 300,
            run: () =>
              createCancelablePolling(500, () => {
                if (!this.props.device) return Promise.reject()
                return Promise.resolve(this.props.device)
              }),
          },
          {
            id: 'address',
            title: ({ device }) =>
              `Open the ${account.currency.name} app on your ${
                device ? `${device.product} ` : 'device'
              }`,
            desc: 'To be able to retriev your Bitcoins',
            icon: Icon ? <Icon size={24} /> : null,
            run: ({ device }) =>
              createCancelablePolling(500, async () => {
                const { address } = await getAddress
                  .send({
                    devicePath: device.path,
                    currencyId: account.currency.id,
                    path: account
                      ? account.freshAddressPath
                      : standardDerivation({ currency: account.currency, segwit: false, x: 0 }),
                    segwit: account ? isSegwitAccount(account) : false,
                  })
                  .toPromise()
                return address
              }),
          },
        ]}
        {...props}
      />
    )
  }
}

export default connect(mapStateToProps)(EnsureDeviceAppInteraction)
