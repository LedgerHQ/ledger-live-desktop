// @flow

import React, { Component } from 'react'
import invariant from 'invariant'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import logger from 'logger'
import getAddress from 'commands/getAddress'
import { createCancelablePolling } from 'helpers/promise'
import { standardDerivation } from 'helpers/derivations'
import { isSegwitAccount } from 'helpers/bip32'

import DeviceInteraction from 'components/DeviceInteraction'
import Text from 'components/base/Text'

import IconUsb from 'icons/Usb'

import type { Device } from 'types/common'

import { createCustomErrorClass } from 'helpers/errors'
import { getCurrentDevice } from 'reducers/devices'

export const WrongAppOpened = createCustomErrorClass('WrongAppOpened')
export const WrongDeviceForAccount = createCustomErrorClass('WrongDeviceForAccount')

const usbIcon = <IconUsb size={36} />
const Bold = props => <Text ff="Open Sans|Bold" {...props} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

class EnsureDeviceApp extends Component<{
  device: ?Device,
  account?: ?Account,
  currency?: ?CryptoCurrency,
}> {
  connectInteractionHandler = () =>
    createCancelablePolling(() => {
      if (!this.props.device) return Promise.reject()
      return Promise.resolve(this.props.device)
    })

  openAppInteractionHandler = ({ device }) =>
    createCancelablePolling(async () => {
      const { account, currency } = this.props
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
        .catch(e => {
          if (
            e &&
            (e.name === 'TransportStatusError' ||
              // we don't want these error to appear (caused by usb disconnect..)
              e.message === 'could not read from HID device' ||
              e.message === 'Cannot write to HID device')
          ) {
            throw new WrongAppOpened(`WrongAppOpened ${cur.id}`, { currencyName: cur.name })
          }
          throw e
        })

      if (account) {
        const { freshAddress } = account
        if (account && freshAddress !== address) {
          logger.warn({ freshAddress, address })
          throw new WrongDeviceForAccount(`WrongDeviceForAccount ${account.name}`, {
            accountName: account.name,
          })
        }
      }
      return address
    })

  renderOpenAppTitle = () => {
    const { account, currency } = this.props
    const cur = account ? account.currency : currency
    invariant(cur, 'No currency given')
    return (
      <Trans i18nKey="deviceConnect:step2.open" parent="div">
        {'Open the '}
        <strong>{cur.name}</strong>
        {' app on your device'}
      </Trans>
    )
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
            title: (
              <Trans i18nKey="app:deviceConnect.step1.connect" parent="div">
                {'Connect and unlock your '}
                <Bold>{'Ledger device'}</Bold>
              </Trans>
            ),
            icon: usbIcon,
            run: this.connectInteractionHandler,
          },
          {
            id: 'address',
            title: this.renderOpenAppTitle,
            icon: Icon ? <Icon size={24} /> : null,
            run: this.openAppInteractionHandler,
          },
        ]}
        {...props}
      />
    )
  }
}

export default connect(mapStateToProps)(EnsureDeviceApp)
