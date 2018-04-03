// @flow

import React from 'react'

import type { Account, Currency } from '@ledgerhq/currencies/lib/types'
import type { Device } from 'types/common'

import DeviceConnect from 'components/DeviceConnect'
import DeviceMonit from 'components/DeviceMonitNew'

type Props = {
  account?: Account,
  currency?: Currency | null,
  deviceSelected: Device | null,
  onChangeDevice: Function,
  onStatusChange: Function,
}

const StepConnectDevice = (props: Props) => (
  <DeviceMonit
    account={props.account}
    coinType={props.currency && props.currency.coinType}
    deviceSelected={props.deviceSelected}
    onStatusChange={props.onStatusChange}
    render={({ coinType, status, devices, deviceSelected }) => (
      <DeviceConnect
        coinType={coinType}
        appOpened={
          status === 'appOpened.success' ? 'success' : status === 'appOpened.fail' ? 'fail' : null
        }
        devices={devices}
        deviceSelected={deviceSelected}
        onChangeDevice={props.onChangeDevice}
      />
    )}
  />
)

StepConnectDevice.defaultProps = {
  account: undefined,
  currency: undefined,
}

export default StepConnectDevice
