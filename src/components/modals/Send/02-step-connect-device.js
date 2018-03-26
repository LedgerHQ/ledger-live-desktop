// @flow

import React from 'react'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import DeviceMonit from 'components/DeviceMonit'

type Props = {
  account: Account | null,
  isDeviceReady: boolean,
  onChange: Function,
}

function StepConnectDevice(props: Props) {
  const { account, isDeviceReady, onChange } = props
  const setReady = onChange('isDeviceReady')
  if (!account) {
    return null
  }
  return (
    <div>
      <DeviceMonit
        account={account}
        onStatusChange={status => {
          if (status === 'appOpened' && !isDeviceReady) {
            setReady(true)
          }
          if (status !== 'appOpened' && isDeviceReady) {
            setReady(false)
          }
        }}
      />
    </div>
  )
}

export default StepConnectDevice
