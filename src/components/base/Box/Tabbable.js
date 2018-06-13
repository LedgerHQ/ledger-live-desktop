// @flow

import React, { PureComponent } from 'react'

import Box from './index'

// Github like focus style:
// - focus states are not visible by default
// - first time user hit tab, enable global tab to see focus states
const __IS_GLOBAL_TAB_ENABLED__ = false

export default class Tabbable extends PureComponent<
  any,
  {
    isFocused: boolean,
  },
> {
  state = {
    isFocused: false,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  handleFocus = () => {
    if (!__IS_GLOBAL_TAB_ENABLED__) return
    this.setState({ isFocused: true })
  }

  handleBlur = () => this.setState({ isFocused: false })

  handleKeydown = (e: SyntheticKeyboardEvent<any>) => {
    if ((e.which === 13 || e.which === 32) && this.state.isFocused && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render() {
    const { disabled } = this.props
    return (
      <Box
        tabIndex={disabled ? undefined : 0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...this.props}
      />
    )
  }
}
