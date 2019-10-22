// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'

import type { T } from 'types/common'

import IconSearch from 'icons/Search'

import Box from 'components/base/Box'

const Container = styled(Box).attrs(() => ({
  grow: true,
  horizontal: true,
  ff: 'Inter|Regular',
  fontSize: 4,
}))``

const Input = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;
`

type State = {
  isFocused: boolean,
}

type Props = {
  t: T,
  isHidden: boolean,
}

class GlobalSearch extends PureComponent<Props, State> {
  state = {
    isFocused: false,
  }

  _input = null

  focusInput = () => {
    if (this._input) {
      this._input.focus()
    }
  }

  handleBlur = () =>
    this.setState({
      isFocused: false,
    })

  handleFocus = () =>
    this.setState({
      isFocused: true,
    })

  render() {
    const { t, isHidden } = this.props
    const { isFocused } = this.state
    return (
      <Container isFocused={isFocused}>
        {!isHidden && (
          <Fragment>
            <Box justifyContent="center" onClick={this.focusInput} pr={2}>
              <IconSearch size={16} />
            </Box>
            <Input
              placeholder={t('common.search')}
              ref={input => (this._input = input)}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              isFocused={isFocused}
            />
          </Fragment>
        )}
      </Container>
    )
  }
}

export default GlobalSearch
