// @flow

import React from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'
import noop from 'lodash/noop'

import { darken, lighten } from 'styles/helpers'

import fontFamily from 'styles/styled/fontFamily'

const Base = styled.button.attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 3,
  px: p => (p.primary ? (p.small ? 2 : 3) : 1),
})`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  ${fontFamily};
  border-radius: ${p => p.theme.radii[1]}px;
  border: none;
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  height: ${p => (p.small ? 30 : 36)}px;
  outline: none;

  &:hover {
    background: ${p => (p.disabled ? '' : p.primary ? lighten(p.theme.colors.wallet, 0.05) : '')};
  }

  &:active {
    color: ${p => (p.primary ? '' : darken(p.theme.colors.grey, 0.2))};
    background: ${p => (p.primary ? darken(p.theme.colors.wallet, 0.1) : '')};
  }
`

type Props = {
  children?: any,
  icon?: string,
  primary?: boolean,
  disabled?: boolean,
  onClick?: Function,
  small?: boolean,
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
  const { onClick, children, primary, disabled } = props

  return (
    <Base
      {...props}
      {...getProps({ primary, disabled })}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Base>
  )
}

Button.defaultProps = {
  children: undefined,
  disabled: undefined,
  icon: undefined,
  onClick: noop,
  primary: false,
  small: false,
}

export default Button
