// @flow

import React from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'
import noop from 'lodash/noop'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'

const Base = styled.button`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  border-radius: 5px;
  border: ${p => (p.primary ? '' : `1px solid ${p.theme.colors.mouse}`)};
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  height: 40px;
  box-shadow: ${p => (p.withShadow ? 'rgba(0, 0, 0, 0.2) 0 3px 10px' : '')};
  outline: none;
`

type Props = {
  children?: any,
  icon?: string,
  primary?: boolean,
  disabled?: boolean,
  onClick?: Function,
}

function getProps({ disabled, icon, primary }: Object) {
  const props = (predicate, props, defaults = {}) => (predicate ? props : defaults)

  return {
    ...props(
      icon,
      {
        fontSize: 3,
        px: 1,
      },
      {
        fontSize: 4,
        px: 3,
      },
    ),
    ...props(
      primary,
      {
        color: 'white',
        bg: 'blue',
        withShadow: true,
      },
      {
        bg: 'transparent',
      },
    ),
    ...props(disabled, {
      color: 'white',
      bg: 'argile',
      withShadow: false,
    }),
  }
}

const Button = ({ children, onClick, primary, icon, disabled, ...props }: Props) => {
  children = icon ? (
    <Box alignItems="center" justifyContent="center">
      <Icon name={icon} />
    </Box>
  ) : (
    children
  )

  return (
    <Base
      {...props}
      {...getProps({ primary, icon, disabled })}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Base>
  )
}

Button.defaultProps = {
  children: undefined,
  icon: undefined,
  disabled: undefined,
  primary: false,
  onClick: noop,
}

export default Button
