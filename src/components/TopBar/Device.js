// @flow

import React from 'react'
import { getDeviceModel } from '@ledgerhq/devices'
import { colors } from 'styles/theme'
import Tooltip from '../base/Tooltip'
import { useDevice } from '../DeviceContextProvider'
import NanoS from '../../icons/device/NanoS'

/**
 * Defaulting to the NanoS icon for simplicity FIXME ?
 */
const Device = () => {
  const [state] = useDevice()
  const { device, maybeConnected, app } = state

  const deviceModel = device ? getDeviceModel(device.modelId) : null
  const renderTooltip = () =>
    maybeConnected
      ? 'working...'
      : device
      ? deviceModel
        ? `${deviceModel.productName} - ${app.name} - ${app.version}`
        : ''
      : 'No device connected'
  const iconColor = device
    ? maybeConnected
      ? colors.orange
      : colors.positiveGreen
    : colors.alertRed

  return (
    <div>
      <Tooltip render={renderTooltip}>
        <NanoS size={20} color={iconColor} />
      </Tooltip>
    </div>
  )
}

export default Device
