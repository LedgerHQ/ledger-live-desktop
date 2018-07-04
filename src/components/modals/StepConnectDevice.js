// @flow

import React from 'react'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import EnsureDeviceApp from 'components/EnsureDeviceApp'

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  onChangeDevice?: Device => void,
  onStatusChange: (string, string) => void,
}

// FIXME why is that in modal !?
const StepConnectDevice = ({ account, currency, onChangeDevice, onStatusChange }: Props) =>
  account || currency ? (
    <EnsureDeviceApp
      account={account}
      currency={currency}
      waitBeforeSuccess={200}
      onSuccess={({ device }) => {
        // TODO: remove those non-nense callbacks
        if (onChangeDevice) {
          onChangeDevice(device)
        }
        onStatusChange('success', 'success')
      }}
    />
  ) : null

export default StepConnectDevice
