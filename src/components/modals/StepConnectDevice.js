// @flow

import React from 'react'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { Currency } from '@ledgerhq/currencies/lib/types'
import type { Device } from 'types/common'

import DeviceConnect from 'components/DeviceConnect'
import DeviceMonit from 'components/DeviceMonitNew'

type Props = {
  accountName?: string,
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
    render={({ coinType, appStatus, devices, deviceSelected }) => (
      <DeviceConnect
        accountName={props.accountName}
        coinType={coinType}
        appOpened={appStatus === 'success' ? 'success' : appStatus === 'fail' ? 'fail' : null}
        devices={devices}
        deviceSelected={deviceSelected}
        onChangeDevice={props.onChangeDevice}
      />
    )}
  />
)

StepConnectDevice.defaultProps = {
  accountName: undefined,
  account: undefined,
  currency: undefined,
}

export default StepConnectDevice
