// @flow

import React, { PureComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'

import type { Element } from 'react'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Search from 'components/base/Search'

type Props = {
  items: Array<Object>,
  itemToString: Function,
  onChange: Function,
  fuseOptions?: Object,
  highlight?: boolean,
  renderHighlight?: string => Element<*>,
}

const Container = styled(Box).attrs({ relative: true, color: 'steel' })``

const SearchInput = styled(Input)`
  border-bottom-left-radius: ${p => (p.isOpen ? 0 : '')};
  border-bottom-right-radius: ${p => (p.isOpen ? 0 : '')};
`

const Item = styled(Box).attrs({
  p: 2,
})`
  background: ${p => (p.highlighted ? p.theme.colors.cream : p.theme.colors.white)};
`

const ItemWrapper = styled(Box)`
  & + & {
    border-top: 1px solid ${p => p.theme.colors.mouse};
  }
`

const Dropdown = styled(Box)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid ${p => p.theme.colors.mouse};
  border-top: none;
  max-height: 300px;
  overflow-y: auto;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
`

class Select extends PureComponent<Props> {
  render() {
    const { items, itemToString, fuseOptions, highlight, renderHighlight, onChange } = this.props
    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        render={({
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          inputValue,
          highlightedIndex,
          openMenu,
        }) => (
          <Container {...getRootProps({ refKey: 'innerRef' })}>
            <SearchInput
              keepEvent
              {...getInputProps({ placeholder: 'Chess?' })}
              isOpen={isOpen}
              onClick={openMenu}
            />
            {isOpen && (
              <Search
                value={inputValue}
                items={items}
                fuseOptions={fuseOptions}
                highlight={highlight}
                renderHighlight={renderHighlight}
                render={items =>
                  items.length ? (
                    <Dropdown>
                      {items.map((item, i) => (
                        <ItemWrapper key={item.key} {...getItemProps({ item })}>
                          <Item highlighted={i === highlightedIndex}>
                            <span>{item.name_highlight || item.name}</span>
                          </Item>
                        </ItemWrapper>
                      ))}
                    </Dropdown>
                  ) : null
                }
              />
            )}
          </Container>
        )}
      />
    )
  }
}

export default Select
