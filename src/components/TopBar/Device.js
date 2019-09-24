// @flow

import React, { Fragment } from 'react'
import { getDeviceModel } from '@ledgerhq/devices'
import { colors } from 'styles/theme'
import Tooltip from '../base/Tooltip'
import { useDevice } from '../DeviceContextProvider'
import NanoS from "../../icons/device/NanoS";

const Device = () => {
  const [state] = useDevice()
  const { device, maybeConnected, app } = state

  if (!device) return null
  const deviceModel = getDeviceModel(device.modelId)
  const MaybeTooltip = deviceModel ? Tooltip : Fragment

  return (
    <div>
      <MaybeTooltip
        render={() =>
          deviceModel ? `${deviceModel.productName} - ${app.name} - ${app.version}` : ''
        }
      >
        <NanoS size={20} color={maybeConnected ? colors.orange : colors.positiveGreen} />
      </MaybeTooltip>
    </div>
  )
}

export default Device
