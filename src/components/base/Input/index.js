// @flow

import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { fontSize } from 'styled-system'
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
  width: 100%;
  background: ${p => p.theme.colors.palette.background.paper};
  pointer-events: none;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  border-radius: 4px;
`

const RenderRightWrapper = styled(Box)`
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    flex: 1;
  }
`

const WarningDisplay = styled(ErrorDisplay)`
  color: ${p => p.theme.colors.warning};
`

const Base = styled.input.attrs(() => ({
  fontSize: 4,
}))`
  font-family: 'Inter';
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

const Input = React.forwardRef(
  (
    {
      renderLeft = null,
      renderRight = null,
      containerProps,
      editInPlace,
      small = false,
      error,
      loading,
      warning,
      disabled,
      onChange,
      keepEvent,
      onEnter,
      onEsc,
      onFocus = noop,
      onBlur = noop,
      ...props
    }: Props,
    inputRef,
  ) => {
    const [isFocus, setFocus] = useState(false)

    const handleChange = useCallback(
      (e: SyntheticInputEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(keepEvent ? e : e.target.value)
        }
      },
      [onChange, keepEvent],
    )

    const handleKeyDown = useCallback(
      (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        // handle enter key
        if (e.which === 13 && onEnter) {
          onEnter(e)
        } else if (e.which === 27 && onEsc) {
          onEsc(e)
        }
      },
      [onEnter, onEsc],
    )

    const handleClick = useCallback(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus()
      }
    }, [inputRef])

    const handleFocus = useCallback(
      (e: SyntheticInputEvent<HTMLInputElement>) => {
        setFocus(true)
        if (onFocus) {
          onFocus(e)
        }
      },
      [onFocus],
    )

    const handleBlur = useCallback(
      (e: SyntheticInputEvent<HTMLInputElement>) => {
        setFocus(false)
        if (onBlur) {
          onBlur(e)
        }
      },
      [onBlur],
    )

    return (
      <Container
        onClick={handleClick}
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
            ref={inputRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
        {renderRight ? <RenderRightWrapper>{renderRight}</RenderRightWrapper> : null}
      </Container>
    )
  },
)

export default Input
