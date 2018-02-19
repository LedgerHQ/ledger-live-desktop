// @flow

import React, { PureComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import { space } from 'styled-system'

import type { Element } from 'react'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Icon from 'components/base/Icon'
import Input from 'components/base/Input'
import Search from 'components/base/Search'
import Text from 'components/base/Text'

import Triangles from './Triangles'

type Props = {
  fuseOptions?: Object,
  highlight?: boolean,
  items: Array<any>,
  itemToString?: Function,
  keyProp?: string,
  maxHeight?: number,
  onChange?: Function,
  placeholder?: string,
  renderHighlight?: string => Element<*>,
  renderItem?: (*) => Element<*>,
  renderSelected?: any => Element<*>,
  searchable?: boolean,
  value?: Object | null,
}

const Container = styled(Box).attrs({ relative: true, color: 'steel' })``

const TriggerBtn = styled(Box).attrs({
  p: 2,
})`
  min-height: 58px;
  ${space};
  border: 1px solid ${p => p.theme.colors.mouse};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.steel};
  background: ${p => p.theme.colors.white};
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

const Item = styled(Box).attrs({
  alignItems: 'center',
  p: 2,
})`
  background: ${p => (p.highlighted ? p.theme.colors.cream : p.theme.colors.white)};
`

const ItemWrapper = styled(Box)`
  & + & {
    border-top: 1px solid ${p => p.theme.colors.mouse};
  }
`

const Dropdown = styled(Box).attrs({
  mt: 1,
})`
  border-radius: 3px;
  border: 1px solid ${p => p.theme.colors.mouse};
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  left: 0;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
`

const FloatingTriangles = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  mr: 2,
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  // to "simulate" border to make arrows appears at the exact same place as
  // the no-input version
  padding-right: 1px;
`

const IconSelected = styled(Box).attrs({
  bg: 'blue',
  color: 'white',
  alignItems: 'center',
  justifyContent: 'center',
})`
  border-radius: 50%;
  height: 15px;
  font-size: 5px;
  width: 15px;
  opacity: ${p => (p.selected ? 1 : 0)};
`

class Select extends PureComponent<Props> {
  static defaultProps = {
    itemToString: (item: Object) => item && item.name,
    keyProp: undefined,
    maxHeight: 300,
  }

  _scrollToSelectedItem = true
  _oldHighlightedIndex = 0
  _useKeyboard = false
  _children = {}

  renderItems = (items: Array<Object>, selectedItem: any, downshiftProps: Object) => {
    const { renderItem, maxHeight, keyProp } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps

    const selectedItemIndex = items.indexOf(selectedItem)

    return (
      <Dropdown>
        {items.length ? (
          <GrowScroll
            maxHeight={maxHeight}
            onUpdate={scrollbar => {
              const currentHighlighted = this._children[highlightedIndex]
              const currentSelectedItem = this._children[selectedItemIndex]

              if (this._useKeyboard && currentHighlighted) {
                scrollbar.scrollIntoView(currentHighlighted, {
                  alignToTop: highlightedIndex < this._oldHighlightedIndex,
                  offsetTop: -1,
                  onlyScrollIfNeeded: true,
                })
              } else if (this._scrollToSelectedItem && currentSelectedItem) {
                window.requestAnimationFrame(() =>
                  scrollbar.scrollIntoView(currentSelectedItem, {
                    offsetTop: -1,
                  }),
                )

                this._scrollToSelectedItem = false
              }

              this._oldHighlightedIndex = highlightedIndex
            }}
          >
            {items.map((item, i) => (
              <ItemWrapper
                key={keyProp ? item[keyProp] : item.key}
                innerRef={n => (this._children[i] = n)}
                {...getItemProps({ item })}
              >
                <Item highlighted={i === highlightedIndex} horizontal flow={10}>
                  <Box grow>
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <span>{item.name_highlight || item.name}</span>
                    )}
                  </Box>
                  <Box>
                    <IconSelected selected={selectedItem === item}>
                      <Icon name="check" />
                    </IconSelected>
                  </Box>
                </Item>
              </ItemWrapper>
            ))}
          </GrowScroll>
        ) : (
          <ItemWrapper>
            <Item>{'No results'}</Item>
          </ItemWrapper>
        )}
      </Dropdown>
    )
  }

  render() {
    const {
      items,
      searchable,
      itemToString,
      fuseOptions,
      highlight,
      renderHighlight,
      renderSelected,
      placeholder,
      onChange,
      value,
      ...props
    } = this.props

    return (
      <Downshift
        selectedItem={value}
        itemToString={itemToString}
        onChange={onChange}
        render={({
          getInputProps,
          getButtonProps,
          getRootProps,
          isOpen,
          inputValue,
          openMenu,
          selectedItem,
          ...downshiftProps
        }) => {
          if (!isOpen) {
            this._scrollToSelectedItem = true
          }

          return (
            <Container
              {...getRootProps({ refKey: 'innerRef' })}
              {...props}
              onKeyDown={() => (this._useKeyboard = true)}
              onKeyUp={() => (this._useKeyboard = false)}
            >
              {searchable ? (
                <Box relative>
                  <Input keepEvent {...getInputProps({ placeholder })} onClick={openMenu} />
                  <FloatingTriangles>
                    <Triangles />
                  </FloatingTriangles>
                </Box>
              ) : (
                <TriggerBtn
                  {...getButtonProps()}
                  tabIndex={0}
                  horizontal
                  alignItems="center"
                  flow={2}
                >
                  <Box grow>
                    {selectedItem && renderSelected ? (
                      renderSelected(selectedItem)
                    ) : (
                      <Text color="mouse">{placeholder}</Text>
                    )}
                  </Box>
                  <Triangles />
                </TriggerBtn>
              )}
              {isOpen &&
                (searchable ? (
                  <Search
                    value={inputValue}
                    items={items}
                    fuseOptions={fuseOptions}
                    highlight={highlight}
                    renderHighlight={renderHighlight}
                    render={items => this.renderItems(items, selectedItem, downshiftProps)}
                  />
                ) : (
                  this.renderItems(items, selectedItem, downshiftProps)
                ))}
            </Container>
          )
        }}
      />
    )
  }
}

export default Select
