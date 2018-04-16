// @flow

import React from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'
import noop from 'lodash/noop'

import { darken, lighten } from 'styles/helpers'

import fontFamily from 'styles/styled/fontFamily'

const buttonStyles = {
  primary: {
    default: p => `
      background: ${p.disabled ? lighten(p.theme.colors.wallet, 0.1) : p.theme.colors.wallet};
      color: white;
    `,
    hover: p => `
      background: ${lighten(p.theme.colors.wallet, 0.05)};
    `,
    active: p => `
      background: ${darken(p.theme.colors.wallet, 0.1)};
    `,
  },
  danger: {
    default: p => `
      background: ${p.disabled ? lighten(p.theme.colors.alertRed, 0.3) : p.theme.colors.alertRed};
      color: white;
    `,
    hover: p => `
      background: ${lighten(p.theme.colors.alertRed, 0.1)};
    `,
    active: p => `
      background: ${darken(p.theme.colors.alertRed, 0.1)};
    `,
  },
  outline: {
    default: p => `
      background: transparent;
      border: 1px solid ${p.theme.colors.wallet};
      color: ${p.theme.colors.wallet};
    `,
    active: p => `
      color: ${darken(p.theme.colors.wallet, 0.1)};
      border-color: ${darken(p.theme.colors.wallet, 0.1)};
    `,
  },
  icon: {
    default: () => `
      font-size: ${fontSize[3]}px;
      padding-left: ${space[1]}px;
      padding-right: ${space[1]}px;
    `,
  },
}

function getStyles(props, state) {
  let output = ``
  for (const s in buttonStyles) {
    if (buttonStyles.hasOwnProperty(s) && props[s] === true) {
      const style = buttonStyles[s][state]
      if (style) {
        output += style(props)
      }
    }
  }
  return output
}

const Base = styled.button.attrs({
  ff: 'Museo Sans|Regular',
  fontSize: p => p.fontSize || 3,
  px: 2,
  color: 'grey',
})`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  ${fontFamily};
  border: none;
  border-radius: ${p => p.theme.radii[1]}px;
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  height: ${p => (p.small ? 30 : 36)}px;
  pointer-events: ${p => (p.disabled ? 'none' : '')};
  outline: none;

  ${p => getStyles(p, 'default')};
  &:hover {
    ${p => getStyles(p, 'hover')};
  }
  &:active {
    ${p => getStyles(p, 'active')};
  }
`

type Props = {
  children?: any,
  icon?: string,
  primary?: boolean,
  danger?: boolean,
  disabled?: boolean,
  onClick?: Function,
  small?: boolean,
}

const Button = (props: Props) => {
  const { onClick, children, disabled } = props

  return (
    <Base {...props} onClick={disabled ? undefined : onClick}>
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
  danger: false,
}

export default Button
