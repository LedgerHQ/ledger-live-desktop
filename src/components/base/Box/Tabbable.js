// @flow

import React, { Component } from 'react'
import styled from 'styled-components'

import { isGlobalTabEnabled } from 'config/global-tab'
import { rgba } from 'styles/helpers'

import Box from './Box'

const KEY_ENTER = 13
const KEY_SPACE = 32

export const focusedShadowStyle = `
  0 0 0 1px ${rgba('#0a84ff', 0.5)} inset,
  0 0 0 1px ${rgba('#0a84ff', 0.3)},
  0 0 0 4px rgba(10, 132, 255, 0.1)
`

const Raw = styled(Box)`
  &:focus {
    outline: none;
    box-shadow: ${p => (p.isFocused && !p.unstyled ? focusedShadowStyle : 'none')};
  }
`

export default class Tabbable extends Component<
  { disabled?: boolean, unstyled?: boolean, onClick?: any => void },
  { isFocused: boolean },
> {
  state = {
    isFocused: false,
  }

  handleFocus = () => {
    if (isGlobalTabEnabled()) {
      this.setState({ isFocused: true })
    }
  }

  handleBlur = () => this.setState({ isFocused: false })

  handleKeyPress = (e: SyntheticKeyboardEvent<*>) => {
    const { isFocused } = this.state
    const { onClick } = this.props
    const canPress =
      (e.which === KEY_ENTER || e.which === KEY_SPACE) && isGlobalTabEnabled() && isFocused
    if (canPress && onClick) onClick(e)
  }

  render() {
    const { disabled } = this.props
    const { isFocused } = this.state
    return (
      <Raw
        tabIndex={disabled ? undefined : 0}
        isFocused={isFocused}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyPress={this.handleKeyPress}
        {...this.props}
      />
    )
  }
}
