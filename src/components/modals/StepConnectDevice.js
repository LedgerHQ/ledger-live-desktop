// @flow

import React from 'react'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import EnsureDeviceAppInteraction from 'components/EnsureDeviceAppInteraction'

type Props = {
  account?: ?Account,
  currency?: ?CryptoCurrency,
  onChangeDevice?: Device => void,
  onStatusChange: (string, string) => void,
}

const StepConnectDevice = ({ account, currency, onChangeDevice, onStatusChange }: Props) =>
  account || currency ? (
    <EnsureDeviceAppInteraction
      account={account}
      currency={currency}
      waitBeforeSuccess={500}
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
