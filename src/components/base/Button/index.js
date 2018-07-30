// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { space, fontSize, fontWeight, color } from 'styled-system'
import noop from 'lodash/noop'
import { track } from 'analytics/segment'

import { isGlobalTabEnabled } from 'config/global-tab'
import { darken, lighten, rgba } from 'styles/helpers'
import fontFamily from 'styles/styled/fontFamily'
import { focusedShadowStyle } from 'components/base/Box/Tabbable'

import Spinner from 'components/base/Spinner'

type Style = any // FIXME

const buttonStyles: { [_: string]: Style } = {
  default: {
    default: p => `
      box-shadow: ${p.isFocused ? focusedShadowStyle : ''}
    `,
    active: p => `
      background: ${rgba(p.theme.colors.fog, 0.3)};
    `,
    hover: p => `
      background: ${rgba(p.theme.colors.fog, 0.2)};
    `,
  },
  primary: {
    default: p => `
      background: ${p.disabled ? `${p.theme.colors.lightFog} !important` : p.theme.colors.wallet};
      color: ${p.disabled ? p.theme.colors.grey : p.theme.colors.white};
      box-shadow: ${
        p.isFocused
          ? `
          0 0 0 1px ${darken(p.theme.colors.wallet, 0.3)} inset,
          0 0 0 1px ${rgba(p.theme.colors.wallet, 0.5)},
          0 0 0 3px ${rgba(p.theme.colors.wallet, 0.3)};`
          : ''
      }
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
      background: ${p.disabled ? `${p.theme.colors.lightFog} !important` : p.theme.colors.alertRed};
      color: ${p.disabled ? p.theme.colors.grey : p.theme.colors.white};
      box-shadow: ${
        p.isFocused
          ? `
          0 0 0 1px ${darken(p.theme.colors.alertRed, 0.3)} inset,
          0 0 0 1px ${rgba(p.theme.colors.alertRed, 0.5)},
          0 0 0 3px ${rgba(p.theme.colors.alertRed, 0.3)};
        `
          : ''
      }
    `,
    hover: p => `
      background: ${lighten(p.theme.colors.alertRed, 0.1)};
     `,
    active: p => `
      background: ${darken(p.theme.colors.alertRed, 0.1)};
     `,
  },
  outline: {
    default: p => {
      const c = p.outlineColor
        ? p.theme.colors[p.outlineColor] || p.outlineColor
        : p.theme.colors.wallet
      return `
        background: transparent;
        border: 1px solid ${c};
        color: ${c};
        box-shadow: ${
          p.isFocused
            ? `
            0 0 0 3px ${rgba(c, 0.3)};`
            : ''
        }
      `
    },
    hover: p => {
      const c = p.outlineColor
        ? p.theme.colors[p.outlineColor] || p.outlineColor
        : p.theme.colors.wallet
      return `
        background: ${rgba(c, 0.1)};
      `
    },
    active: p => `
      color: ${darken(
        p.outlineColor ? p.theme.colors[p.outlineColor] || p.outlineColor : p.theme.colors.wallet,
        0.1,
      )};
      border-color: ${darken(
        p.outlineColor ? p.theme.colors[p.outlineColor] || p.outlineColor : p.theme.colors.wallet,
        0.1,
      )};
    `,
  },
  outlineGrey: {
    default: p => `
      background: transparent;
      border: 1px solid ${p.theme.colors.grey};
      color: ${p.theme.colors.grey};
    `,
    active: p => `
      color: ${darken(p.theme.colors.grey, 0.1)};
      border-color: ${darken(p.theme.colors.grey, 0.1)};
    `,
  },
  icon: {
    default: () => `
      font-size: ${fontSize[3]}px;
      padding-left: ${space[1]}px;
      padding-right: ${space[1]}px;
    `,
  },
  isLoading: {
    default: () => `
      padding-left: 40px;
      padding-right: 40px;
      pointer-events: none;
      opacity: 0.7;
    `,
  },
}

function getStyles(props, state) {
  let output = ``
  let hasModifier = false
  for (const s in buttonStyles) {
    if (buttonStyles.hasOwnProperty(s) && props[s] === true) {
      const style = buttonStyles[s][state]
      if (style) {
        hasModifier = true
        output += style(props)
      }
    }
  }
  if (!hasModifier) {
    const defaultStyle = buttonStyles.default[state]
    if (defaultStyle) {
      output += defaultStyle(props) || ''
    }
  }
  return output
}

const Base = styled.button.attrs({
  ff: 'Museo Sans|Regular',
  fontSize: p => p.fontSize || (!p.small ? 4 : 3),
  px: p => (!p.small ? 4 : 3),
  py: p => (!p.small ? 2 : 0),
  color: 'grey',
  bg: 'transparent',
})`
  ${space};
  ${color};
  ${fontSize};
  ${fontWeight};
  ${fontFamily};
  border: none;
  border-radius: ${p => p.theme.radii[1]}px;
  cursor: ${p => (p.disabled ? 'not-allowed' : 'default')};
  height: ${p => (p.small ? 34 : 40)}px;
  pointer-events: ${p => (p.disabled ? 'none' : '')};
  outline: none;

  ${p => getStyles(p, 'default')};

  &:hover {
    ${p => getStyles(p, 'hover')};
  }
  &:active {
    ${p => getStyles(p, 'active')};
  }
  &:focus {
    ${p => getStyles(p, 'focus')};
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
  isLoading?: boolean,
  event?: string,
  eventProperties?: Object,
}

class Button extends PureComponent<
  Props,
  {
    isFocused: boolean,
  },
> {
  static defaultProps = {
    onClick: noop,
    primary: false,
    small: false,
    danger: false,
  }

  state = {
    isFocused: false,
  }

  handleFocus = () => {
    if (isGlobalTabEnabled()) {
      this.setState({ isFocused: true })
    }
  }

  handleBlur = () => {
    this.setState({ isFocused: false })
  }

  render() {
    const { isFocused } = this.state
    const { disabled } = this.props
    const { onClick, children, isLoading, event, eventProperties, ...rest } = this.props
    const isClickDisabled = disabled || isLoading
    const onClickHandler = e => {
      if (onClick) {
        if (event) {
          track(event, eventProperties)
        }
        onClick(e)
      }
    }
    return (
      <Base
        {...rest}
        onClick={isClickDisabled ? undefined : onClickHandler}
        isFocused={isFocused}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {isLoading ? <Spinner size={16} /> : children}
      </Base>
    )
  }
}

export default Button
