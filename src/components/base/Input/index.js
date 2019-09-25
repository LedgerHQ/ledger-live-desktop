// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { fontSize, space } from 'styled-system'
import noop from 'lodash/noop'
import fontFamily from 'styles/styled/fontFamily'
import Spinner from 'components/base/Spinner'
import Box from 'components/base/Box'
import TranslatedError from 'components/TranslatedError'

const Container = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  background: ${p =>
    p.disabled
      ? p.theme.colors.palette.background.default
      : p.theme.colors.palette.background.paper};
  border-radius: ${p => p.theme.radii[1]}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${p =>
    p.error
      ? p.theme.colors.pearl
      : p.warning
      ? p.theme.colors.warning
      : p.isFocus
      ? p.theme.colors.wallet
      : p.theme.colors.palette.divider};
  box-shadow: ${p => (p.isFocus ? `rgba(0, 0, 0, 0.05) 0 2px 2px` : 'none')};
  height: ${p => (p.small ? '34' : '40')}px;
  position: relative;

  &:not(:hover) {
    background: ${p => (!p.isFocus && p.editInPlace ? 'transparent' : undefined)};
    border-color: ${p => (!p.isFocus && p.editInPlace ? 'transparent' : undefined)};
  }
`

const ErrorDisplay = styled(Box)`
  position: absolute;
  bottom: -20px;
  left: 0px;
  font-size: 12px;
  white-space: nowrap;
  color: ${p => p.theme.colors.pearl};
`

const LoadingDisplay = styled(Box)`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background: ${p => p.theme.colors.palette.background.paper};
  pointer-events: none;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  border-radius: 4px;
`

const WarningDisplay = styled(ErrorDisplay)`
  color: ${p => p.theme.colors.warning};
`

const Base = styled.input.attrs(() => ({
  fontSize: 4,
}))`
  font-family: 'Open Sans';
  font-weight: 600;
  ${fontFamily};
  ${fontSize};
  border: 0;
  color: ${p => p.theme.colors.palette.text.shade80};
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;
  background: none;
  cursor: text;

  &::placeholder {
    color: ${p => p.theme.colors.palette.divider};
  }
`

export const Textarea = styled.textarea.attrs(p => ({
  p: 2,
  fontSize: 4,
  ff: p.ff || 'Open Sans|SemiBold',
}))`
  ${space};
  ${fontFamily};
  ${fontSize};
  min-height: 80px;
  color: ${p => p.theme.colors.palette.text.shade100};
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: ${p => p.theme.radii[1]}px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
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
  onEnter?: (SyntheticKeyboardEvent<HTMLInputElement>) => *,
  onEsc?: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onFocus: (SyntheticInputEvent<HTMLInputElement>) => void,
  renderLeft?: any,
  renderRight?: any,
  containerProps?: Object,
  loading?: boolean,
  error?: ?Error | boolean,
  warning?: ?Error | boolean,
  small?: boolean,
  editInPlace?: boolean,
  disabled?: boolean,
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

  select = () => {
    const { _input } = this
    if (_input) {
      _input.select()
      _input.focus()
    }
  }

  _input = null

  render() {
    const { isFocus } = this.state
    const {
      renderLeft,
      renderRight,
      containerProps,
      editInPlace,
      small,
      error,
      loading,
      warning,
      disabled,
      ...props
    } = this.props

    return (
      <Container
        onClick={this.handleClick}
        isFocus={isFocus}
        shrink
        {...containerProps}
        disabled={disabled}
        small={small}
        error={error}
        warning={warning}
        editInPlace={editInPlace}
      >
        {renderLeft}
        <Box px={3} grow shrink>
          <Base
            {...props}
            small={small}
            disabled={disabled}
            ref={n => (this._input = n)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          {error ? (
            <ErrorDisplay>
              <TranslatedError error={error} />
            </ErrorDisplay>
          ) : warning ? (
            <WarningDisplay>
              <TranslatedError error={warning} />
            </WarningDisplay>
          ) : null}
          {loading && !isFocus ? (
            <LoadingDisplay>
              <Spinner size={16} />
            </LoadingDisplay>
          ) : null}
        </Box>
        {renderRight}
      </Container>
    )
  }
}

export default Input
