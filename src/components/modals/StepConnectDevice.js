// @flow

import React from 'react'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import EnsureDeviceAppInteraction from 'components/EnsureDeviceAppInteraction'

type Props = {
  account?: ?Account,
  onChangeDevice?: Device => void,
  onStatusChange: (string, string) => void,
}

const StepConnectDevice = ({ account, onChangeDevice, onStatusChange }: Props) =>
  account ? (
    <EnsureDeviceAppInteraction
      account={account}
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
