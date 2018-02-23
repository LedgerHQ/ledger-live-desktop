// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import type { T } from 'types/common'

import IconSearch from 'icons/Search'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  grow: true,
  horizontal: true,
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
})``

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
    const { t } = this.props
    const { isFocused } = this.state

    return (
      <Container isFocused={isFocused}>
        <Box justifyContent="center" onClick={this.focusInput} pr={2}>
          <IconSearch height={16} width={16} />
        </Box>
        <Input
          placeholder={t('global.search')}
          innerRef={input => (this._input = input)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          isFocused={isFocused}
        />
      </Container>
    )
  }
}

export default GlobalSearch
