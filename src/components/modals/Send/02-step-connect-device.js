// @flow

import React from 'react'

import DeviceMonit from 'components/DeviceMonit'
import type { Account } from 'types/common'

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
