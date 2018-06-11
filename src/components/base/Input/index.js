// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { fontSize, space } from 'styled-system'
import noop from 'lodash/noop'

import fontFamily from 'styles/styled/fontFamily'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  horizontal: true,
})`
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radii[1]}px;
  border: 1px solid
    ${p =>
      p.error ? p.theme.colors.pearl : p.isFocus ? p.theme.colors.wallet : p.theme.colors.fog};
  box-shadow: ${p => (p.isFocus ? `rgba(0, 0, 0, 0.05) 0 2px 2px` : 'none')};
  height: ${p => (p.small ? '34' : '40')}px;
  position: relative;
`

const ErrorDisplay = styled(Box)`
  position: absolute;
  bottom: -20px;
  left: 0px;
  font-size: 12px;
  color: ${p => p.theme.colors.pearl};
`

const Base = styled.input.attrs({
  ff: p => (p.ff || p.small ? 'Open Sans' : 'Open Sans|SemiBold'),
  fontSize: 4,
})`
  ${fontFamily};
  ${fontSize};
  border: 0;
  color: ${p => p.theme.colors.graphite};
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;

  &::placeholder {
    color: ${p => p.theme.colors.fog};
  }
`

export const Textarea = styled.textarea.attrs({
  p: 2,
  fontSize: 4,
  ff: p => p.ff || 'Open Sans|SemiBold',
})`
  ${space};
  ${fontFamily};
  ${fontSize};
  min-height: 80px;
  color: ${p => p.theme.colors.dark};
  background: ${p => p.theme.colors.white};
  border-radius: ${p => p.theme.radii[1]}px;
  border: 1px solid ${p => p.theme.colors.fog};
  box-shadow: none;
  &:focus {
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
    outline: none;
  }
`

type Props = {
  keepEvent?: boolean,
  onBlur: (SyntheticInputEvent<HTMLInputElement>) => void,
  onChange?: Function,
  onEnter?: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onEsc?: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onFocus: (SyntheticInputEvent<HTMLInputElement>) => void,
  renderLeft?: any,
  renderRight?: any,
  containerProps?: Object,
  error?: string | boolean,
  small?: boolean,
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
    small: false,
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

  handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    // handle enter key
    if (e.which === 13) {
      const { onEnter } = this.props
      if (onEnter) {
        onEnter(e)
      }
    } else if (e.which === 27) {
      const { onEsc } = this.props
      if (onEsc) {
        onEsc(e)
      }
    }
  }

  // FIXME this is a bad idea! this is the behavior of an input. instead renderLeft/renderRight should be pointer-event:none !
  handleClick = () => this._input && this._input.focus()

  handleFocus = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onFocus } = this.props
    this.setState({
      isFocus: true,
    })
    onFocus(e)
  }

  handleBlur = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onBlur } = this.props
    this.setState({
      isFocus: false,
    })
    onBlur(e)
  }

  handleSelectEverything = () => {
    this._input && this._input.setSelectionRange(0, this._input.value.length)
    this._input && this._input.focus()
  }

  _input = null

  render() {
    const { isFocus } = this.state
    const { renderLeft, renderRight, containerProps, small, error } = this.props

    return (
      <Container
        onClick={this.handleClick}
        isFocus={isFocus}
        shrink
        {...containerProps}
        small={small}
        error={error}
      >
        {renderLeft}
        <Box px={3} grow shrink>
          <Base
            {...this.props}
            small={small}
            innerRef={n => (this._input = n)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          {error && typeof error === 'string' ? <ErrorDisplay>{error}</ErrorDisplay> : null}
        </Box>
        {renderRight}
      </Container>
    )
  }
}

export default Input
