// @flow

import React from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'
import noop from 'lodash/noop'

import { darken, lighten } from 'styles/helpers'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'

const Base = styled.button`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  border-radius: 5px;
  border: ${p =>
    p.primary ? 'none' : `2px solid ${p.disabled ? 'transparent' : p.theme.colors.grey}`};
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  height: 40px;
  outline: none;

  &:hover {
    background: ${p => (p.primary ? lighten(p.theme.colors.wallet, 0.05) : '')};
  }

  &:active {
    background: ${p => (p.primary ? darken(p.theme.colors.wallet, 0.1) : '')};
  }
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
    color: 'grey',
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
        bg: 'wallet',
      },
      {
        bg: 'transparent',
      },
    ),
    ...props(disabled, {
      color: 'white',
      bg: 'fog',
    }),
  }
}

const Button = (props: Props) => {
  const { onClick, primary, icon, disabled } = props
  let { children } = props
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
