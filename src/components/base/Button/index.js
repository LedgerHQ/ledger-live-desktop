// @flow

import React from 'react'
import styled from 'styled-components'
import { borderColor, borderWidth, space, fontSize, fontWeight, color } from 'styled-system'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'

const Base = styled.button`
  ${borderColor};
  ${borderWidth};
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  border-radius: 5px;
  cursor: pointer;
  height: 40px;
  box-shadow: ${p => (p.withShadow ? 'rgba(0, 0, 0, 0.2) 0 3px 10px' : '')};
  outline: none;
`

type Props = {
  children?: any,
  icon?: string,
  primary?: boolean,
}

const Button = ({ primary, children, icon, ...props }: Props) => {
  children = icon ? (
    <Box align="center" justify="center">
      <Icon name={icon} />
    </Box>
  ) : (
    children
  )

  props = {
    ...props,
    bg: 'transparent',
    color: 'mouse',
    ...(icon
      ? {
          fontSize: 3,
          px: 1,
        }
      : {
          fontSize: 1,
          px: 3,
        }),
    ...(primary
      ? {
          color: 'white',
          bg: 'blue',
          borderWidth: 0,
          withShadow: true,
        }
      : {
          borderColor: 'mouse',
          borderWidth: 1,
        }),
  }

  return (
    <Base {...props} icon={icon}>
      {children}
    </Base>
  )
}

Button.defaultProps = {
  children: undefined,
  icon: undefined,
  primary: false,
}

export default Button
