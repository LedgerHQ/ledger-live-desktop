// @flow
import React from 'react'
import styled from 'styled-components'

import NanoS from './NanoS'
import NanoX from './NanoX'
import Blue from './Blue'

type TypeProps = {
  type: 'nanoS' | 'nanoX' | 'blue',
}

export type ScreenTypes =
  | 'validation'
  | 'home'
  | 'pin'
  | 'empty'
  | 'bootloaderMode'
  | 'bootloader'
  | 'recovery'
  | 'update'

export type Props = {
  wire?: 'wired' | 'disconnecting' | 'connecting',
  action?: 'left' | 'accept',
  screen?: ScreenTypes,
  width?: number,
  error?: ?Error,
}

export const Wrapper = styled.div`
  position: relative;
`

const usbMap = {
  wired: 'plugged',
  disconnecting: 'unplugHint',
  connecting: 'plugHint',
}

const devices = {
  blue: Blue,
  nanoX: NanoX,
  nanoS: NanoS,
}

const Interactions = ({
  type = 'nanoS',
  wire,
  screen,
  error,
  action,
  ...rest
}: TypeProps & Props) => {
  const Device = devices[type]
  const props = {
    error: !!error,
    screen: error ? 'fail' : screen,
    usb: wire && usbMap[wire],
    leftHint: action === 'left' || (type === 'nanoX' && action === 'accept'),
    rightHint: action === 'accept',
  }

  return <Device open {...rest} {...props} />
}

export default Interactions
