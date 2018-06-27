// @flow

import React from 'react'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import DeviceConnect from 'components/DeviceConnect'
import EnsureDeviceApp from 'components/EnsureDeviceApp'

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  deviceSelected?: ?Device,
  onChangeDevice?: Device => void,
  onStatusChange: string => void,
}

// FIXME why is that in modal !?
const StepConnectDevice = ({
  account,
  currency,
  deviceSelected,
  onChangeDevice,
  onStatusChange,
}: Props) => (
  <EnsureDeviceApp
    account={account}
    currency={currency}
    deviceSelected={deviceSelected}
    onStatusChange={onStatusChange}
    render={({ currency, appStatus, devices, deviceSelected, error }) => (
      <DeviceConnect
        currency={currency}
        appOpened={appStatus === 'success' ? 'success' : appStatus === 'fail' ? 'fail' : null}
        devices={devices}
        deviceSelected={deviceSelected}
        onChangeDevice={onChangeDevice}
        error={error}
      />
    )}
  />
)

export default StepConnectDevice
