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
  background: ${p => (p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.white)};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.fog)};
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;
  font-family: 'Open Sans';
  cursor: text;
  color: ${p => p.theme.colors.dark};
  &::placeholder {
    color: #999999;
  }
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
        <Box pr={3} justify="center" color={focused || search ? '#142533' : '#999999'}>
          <SearchIcon size={16} />
        </Box>
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
