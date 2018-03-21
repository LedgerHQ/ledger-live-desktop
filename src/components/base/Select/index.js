// @flow

import React, { PureComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import { space } from 'styled-system'

import type { Element } from 'react'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Input from 'components/base/Input'
import Search from 'components/base/Search'
import Text from 'components/base/Text'

import IconCheck from 'icons/Check'
import IconAngleDown from 'icons/AngleDown'

type Props = {
  bg?: string,
  flatLeft?: boolean,
  flatRight?: boolean,
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

const Container = styled(Box).attrs({ relative: true, color: 'graphite' })``

const TriggerBtn = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  pl: 3,
  pr: 5,
})`
  ${space};
  height: 40px;
  background: ${p => p.bg || p.theme.colors.white};
  border-bottom-left-radius: ${p => (p.flatLeft ? 0 : p.theme.radii[1])}px;
  border-bottom-right-radius: ${p => (p.flatRight ? 0 : p.theme.radii[1])}px;
  border-top-left-radius: ${p => (p.flatLeft ? 0 : p.theme.radii[1])}px;
  border-top-right-radius: ${p => (p.flatRight ? 0 : p.theme.radii[1])}px;
  border: 1px solid ${p => p.theme.colors.fog};
  color: ${p => p.theme.colors.graphite};
  cursor: pointer;
  display: flex;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

const Item = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  ff: p => `Open Sans|${p.selected ? 'SemiBold' : 'Regular'}`,
  px: 3,
  py: 2,
  color: 'dark',
})`
  background: ${p => (p.highlighted ? p.theme.colors.lightGrey : p.theme.colors.white)};

  ${p =>
    p.first &&
    `
    border-top-left-radius: ${p.theme.radii[1]}px;
    border-top-right-radius: ${p.theme.radii[1]}px;
  `} ${p =>
    p.last &&
    `
    border-bottom-left-radius: ${p.theme.radii[1]}px;
    border-bottom-right-radius: ${p.theme.radii[1]}px;
  `};
`

const Dropdown = styled(Box).attrs({
  mt: 1,
})`
  border-radius: ${p => p.theme.radii[1]}px;
  border: 1px solid ${p => p.theme.colors.fog};
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  left: 0;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
`

const FloatingDown = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  mr: 2,
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  color: ${p => p.theme.colors.grey};

  // to "simulate" border to make arrows appears at the exact same place as
  // the no-input version
  padding-right: 1px;
`

const IconSelected = styled(Box).attrs({
  color: 'wallet',
  alignItems: 'center',
  justifyContent: 'center',
})`
  height: 12px;
  width: 12px;
  opacity: ${p => (p.selected ? 1 : 0)};
`

class Select extends PureComponent<Props> {
  static defaultProps = {
    bg: undefined,
    flatLeft: false,
    flatRight: false,
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
              <Box
                key={keyProp ? item[keyProp] : item.key}
                innerRef={n => (this._children[i] = n)}
                {...getItemProps({ item })}
              >
                <Item
                  first={i === 0}
                  last={i === items.length - 1}
                  highlighted={i === highlightedIndex}
                  selected={selectedItem === item}
                  horizontal
                  flow={3}
                >
                  <Box grow>
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <span>{item.name_highlight || item.name}</span>
                    )}
                  </Box>
                  <Box>
                    <IconSelected selected={selectedItem === item}>
                      <IconCheck height={12} width={12} />
                    </IconSelected>
                  </Box>
                </Item>
              </Box>
            ))}
          </GrowScroll>
        ) : (
          <Box>
            <Item>{'No results'}</Item>
          </Box>
        )}
      </Dropdown>
    )
  }

  render() {
    const {
      flatLeft,
      flatRight,
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
          getToggleButtonProps,
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
                  <FloatingDown>
                    <IconAngleDown width={16} height={16} />
                  </FloatingDown>
                </Box>
              ) : (
                <TriggerBtn
                  {...getToggleButtonProps()}
                  bg={props.bg}
                  alignItems="center"
                  flatLeft={flatLeft}
                  flatRight={flatRight}
                  flow={2}
                  horizontal
                  tabIndex={0}
                >
                  <Box grow>
                    {selectedItem && renderSelected ? (
                      renderSelected(selectedItem)
                    ) : (
                      <Text color="fog">{placeholder}</Text>
                    )}
                  </Box>
                  <FloatingDown>
                    <IconAngleDown width={16} height={16} />
                  </FloatingDown>
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
