// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import styled from 'styled-components'
import SearchIcon from 'icons/Search'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import AccountsOrder from './Order'
import AccountsRange from './Range'

import GridIcon from '../../../icons/Grid'
import ListIcon from '../../../icons/List'
import Button from '../../base/Button'
import { GenericBox } from '../index'

type Props = {
  onModeChange: (*) => void,
  onTextChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  onRangeChange: PortfolioRange => void,
  mode: string,
  search?: string,
  range?: string,
}

const ToggleButton = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;
  font-family: 'Inter';
  cursor: text;
  color: ${p => p.theme.colors.palette.text.shade100};
  &::placeholder {
    color: #999999;
    font-weight: 500;
  }
`

const SearchIconContainer = styled(Box).attrs(p => ({
  style: {
    color: p.focused ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade40,
  },
}))`
  justify-content: center;
`

class Header extends PureComponent<Props, { focused: boolean }> {
  state = {
    focused: false,
  }
  onFocus = () => {
    this.setState({ focused: true })
  }
  onBlur = () => {
    this.setState({ focused: false })
  }
  render() {
    const { onModeChange, onTextChange, onRangeChange, mode, search, range } = this.props
    const { focused } = this.state

    return (
      <GenericBox horizontal p={0} alignItems="center">
        <SearchIconContainer pr={3} focused={focused || search}>
          <SearchIcon size={16} />
        </SearchIconContainer>
        <SearchInput
          autoFocus
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          placeholder="Search"
          onChange={onTextChange}
          value={search}
        />
        <AccountsRange onRangeChange={onRangeChange} range={range} />
        <Box ml={4} mr={4}>
          <AccountsOrder />
        </Box>
        <ToggleButton mr={1} onClick={() => onModeChange('list')} active={mode === 'list'}>
          <ListIcon />
        </ToggleButton>
        <ToggleButton onClick={() => onModeChange('card')} active={mode === 'card'}>
          <GridIcon />
        </ToggleButton>
      </GenericBox>
    )
  }
}

export default Header
