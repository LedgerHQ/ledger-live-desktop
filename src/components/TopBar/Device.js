// @flow

import React, { Fragment } from 'react'
import { getDeviceModel } from '@ledgerhq/devices'
import { colors } from 'styles/theme'
import Tooltip from '../base/Tooltip'
import { useDevice } from '../DeviceContextProvider'

const Device = () => {
  const [state] = useDevice()
  const { device, maybeConnected } = state
  if (!device) return null

  let Icon = device.Icon

  const deviceModel = getDeviceModel(device.modelId)
  const MaybeTooltip = deviceModel ? Tooltip : Fragment

  return (
    <div>
      <MaybeTooltip render={() => (deviceModel ? `${deviceModel.productName} ` : '')}>
        <Icon size={20} color={maybeConnected ? colors.orange : colors.positiveGreen} />
      </MaybeTooltip>
    </div>
  )
}

export default Device
