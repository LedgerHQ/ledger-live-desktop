// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'

const Input = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;

  &::placeholder {
    color: ${p => p.theme.colors.warmGrey};
  }
`

class GlobalSearch extends PureComponent<{}> {
  _input = null

  focusInput = () => {
    if (this._input) {
      this._input.focus()
    }
  }

  render() {
    return (
      <Box grow horizontal>
        <Box justify="center" onClick={this.focusInput} pr={2}>
          <Icon name="search" />
        </Box>
        <Input placeholder="Search" innerRef={input => (this._input = input)} />
      </Box>
    )
  }
}

export default GlobalSearch
