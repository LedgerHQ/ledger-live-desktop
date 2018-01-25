// @flow

import React from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'

const Base = styled.button.attrs({
  px: 4,
  fontSize: 1,
})`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  border-radius: 5px;
  border: none;
  height: 40px;
  box-shadow: ${p => (p.withShadow ? 'rgba(0, 0, 0, 0.2) 0 3px 10px' : '')};
  outline: none;
`

type Props = {
  primary?: boolean,
}

const Button = ({ primary, ...props }: Props) => {
  if (primary) {
    return <Base fontWeight="bold" color="white" bg="blue" withShadow {...props} />
  }
  return <Base {...props} />
}

Button.defaultProps = {
  primary: false,
}

export default Button
