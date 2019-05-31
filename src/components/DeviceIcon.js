// @flow

import React from 'react'
import NanoS from 'icons/device/NanoS'
import NanoX from 'icons/device/NanoX'
import Blue from 'icons/device/Blue'

const DeviceIcon = ({ type, size }: { type: string, size: number }) => {
  switch (type) {
    case 'blue':
      return <Blue size={size} />
    case 'nanoX':
      return <NanoX size={size} />
    default:
      return <NanoS size={size} />
  }
}

export default DeviceIcon
