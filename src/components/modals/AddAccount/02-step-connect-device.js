// @flow

import React from 'react'

import type { Currency } from '@ledgerhq/currencies/lib/types'

import type { Device } from 'types/common'

import DeviceConnect from 'components/DeviceConnect'
import DeviceMonit from 'components/DeviceMonitNew'

type Props = {
  currency: Currency | null,
  deviceSelected: Device | null,
  onChangeDevice: Function,
  onStatusChange: Function,
}

export default (props: Props) => (
  <DeviceMonit
    coinType={props.currency && props.currency.coinType}
    deviceSelected={props.deviceSelected}
    onStatusChange={props.onStatusChange}
    render={({ status, devices, deviceSelected }) => (
      <DeviceConnect
        coinType={props.currency && props.currency.coinType}
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
