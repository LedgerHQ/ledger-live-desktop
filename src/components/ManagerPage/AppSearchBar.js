// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { color, fontSize, space } from 'styled-system'
import fontFamily from 'styles/styled/fontFamily'

import { ff } from 'styles/helpers'

import Box from 'components/base/Box'
import Search from 'components/base/Search'

import SearchIcon from 'icons/Search'
import CrossIcon from 'icons/Cross'

type LedgerApp = {
  name: string,
  version: string,
  icon: string,
  app: Object,
  bolos_version: {
    min: number,
    max: number,
  },
}

type Props = {
  list: Array<LedgerApp>,
  children: (list: Array<LedgerApp>) => React$Node,
}

type State = {
  query: string,
  focused: boolean,
}

const SearchBarWrapper = styled(Box).attrs({
  horizontal: true,
  borderRadius: 4,
})`
  height: 42px;
  width: 100%;
  margin: 0 0 20px 0;
  background-color: white;
  padding: 0 13px;
`

const Input = styled.input.attrs({
  ff: 'Open Sans|SemiBold',
  color: 'dark',
  mx: 3,
  fontSize: 4,
})`
  ${space};
  ${fontFamily};
  ${fontSize};
  ${color};

  border: 0;
  flex: 1;
  outline: none;
  background: transparent;

  &::placeholder {
    color: ${p => p.theme.colors.fog};
    ${() => ff('Open Sans|Regular')};
  }
`

class AppSearchBar extends PureComponent<Props, State> {
  state = {
    query: '',
    focused: false,
  }

  handleChange = (e: any) => this.setState({ query: e.target.value })

  handleFocus = (bool: boolean) => () => this.setState({ focused: bool })

  reset = () => {
    const { input } = this
    this.setState(state => ({ ...state, query: '' }), () => input && input.focus())
  }

  input = null

  render() {
    const { children, list } = this.props
    const { query, focused } = this.state

    const color = focused ? 'black' : 'grey'

    return (
      <Box>
        <SearchBarWrapper align="center">
          <SearchIcon size={16} style={{ color }} />
          <Input
            innerRef={c => (this.input = c)}
            type="text"
            value={query}
            onChange={this.handleChange}
            onFocus={this.handleFocus(true)}
            onBlur={this.handleFocus(false)}
            placeholder={'Search app'}
          />
          {!!query && <CrossIcon size={16} cursor="pointer" onClick={this.reset} />}
        </SearchBarWrapper>
        <Search
          fuseOptions={{
            threshold: 0.5,
            keys: ['name'],
          }}
          value={query}
          items={list}
          render={items => children(items)}
        />
      </Box>
    )
  }
}

export default AppSearchBar
