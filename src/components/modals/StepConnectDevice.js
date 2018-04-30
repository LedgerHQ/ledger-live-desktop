// @flow

import React from 'react'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import DeviceConnect from 'components/DeviceConnect'
import DeviceMonit from 'components/DeviceMonitNew'

type Props = {
  accountName?: string,
  account?: ?Account,
  currency?: ?CryptoCurrency,
  deviceSelected: ?Device,
  onChangeDevice: Function,
  onStatusChange: Function,
}

const StepConnectDevice = (props: Props) => (
  <DeviceMonit
    account={props.account}
    currency={props.currency}
    deviceSelected={props.deviceSelected}
    onStatusChange={props.onStatusChange}
    render={({ currency, appStatus, devices, deviceSelected }) => (
      <DeviceConnect
        accountName={props.accountName}
        currency={currency}
        appOpened={appStatus === 'success' ? 'success' : appStatus === 'fail' ? 'fail' : null}
        devices={devices}
        deviceSelected={deviceSelected}
        onChangeDevice={props.onChangeDevice}
      />
    )}
  />
)

export default StepConnectDevice
