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
  deviceSelected?: ?Device,
  onChangeDevice: Device => void,
  onStatusChange: string => void,
}

const StepConnectDevice = ({
  account,
  currency,
  accountName,
  deviceSelected,
  onChangeDevice,
  onStatusChange,
}: Props) => (
  <DeviceMonit
    account={account}
    currency={currency}
    deviceSelected={deviceSelected}
    onStatusChange={onStatusChange}
    render={({ currency, appStatus, devices, deviceSelected }) => (
      <DeviceConnect
        accountName={accountName}
        currency={currency}
        appOpened={appStatus === 'success' ? 'success' : appStatus === 'fail' ? 'fail' : null}
        devices={devices}
        deviceSelected={deviceSelected}
        onChangeDevice={onChangeDevice}
      />
    )}
  />
)

export default StepConnectDevice
