// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { fontSize } from 'styled-system'

import noop from 'lodash/noop'

import fontFamily from 'styles/styled/fontFamily'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  horizontal: true,
})`
  background: ${p => p.theme.colors.white};
  border-radius: 3px;
  border: 1px solid ${p => p.theme.colors.fog};
  box-shadow: ${p => (p.isFocus ? `rgba(0, 0, 0, 0.05) 0 2px 2px` : 'none')};
  height: 40px;
`

const Base = styled.input.attrs({
  ff: p => p.ff || 'Open Sans|SemiBold',
  fontSize: 4,
})`
  ${fontFamily};
  ${fontSize};
  border: 0;
  color: ${p => p.theme.colors.dark};
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;

  &::placeholder {
    color: ${p => p.theme.colors.fog};
  }
`

type Props = {
  keepEvent?: boolean,
  onBlur: Function,
  onChange?: Function,
  onFocus: Function,
  renderLeft?: any,
  renderRight?: any,
}

type State = {
  isFocus: boolean,
}

class Input extends PureComponent<Props, State> {
  static defaultProps = {
    onBlur: noop,
    onFocus: noop,
    renderLeft: null,
    renderRight: null,
  }

  state = {
    isFocus: false,
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange, keepEvent } = this.props

    if (onChange) {
      onChange(keepEvent ? e : e.target.value)
    }
  }

  handleClick = () => this._input && this._input.focus()

  handleFocus = () => {
    const { onFocus } = this.props
    this.setState({
      isFocus: true,
    })
    onFocus()
  }

  handleBlur = () => {
    const { onBlur } = this.props
    this.setState({
      isFocus: false,
    })
    onBlur()
  }

  _input = null

  render() {
    const { isFocus } = this.state
    const { renderLeft, renderRight } = this.props

    return (
      <Container onClick={this.handleClick} isFocus={isFocus} shrink>
        {renderLeft}
        <Box px={3} grow shrink>
          <Base
            {...this.props}
            innerRef={n => (this._input = n)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </Box>
        {renderRight}
      </Container>
    )
  }
}

export default Input
