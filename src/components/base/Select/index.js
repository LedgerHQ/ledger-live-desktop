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

type Props = {
  bg?: string,
  flatLeft?: boolean,
  flatRight?: boolean,
  fakeFocusRight?: boolean,
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
  disabled: boolean,
  small?: boolean,
}

const Container = styled(Box).attrs({ relative: true, color: 'graphite' })``

const TriggerBtn = styled(Box).attrs({
  alignItems: 'center',
  ff: p => (p.small ? 'Open Sans' : 'Open Sans|SemiBold'),
  flow: 2,
  fontSize: p => (p.small ? 3 : 4),
  horizontal: true,
  px: 3,
})`
  ${space};
  height: ${p => (p.small ? '34' : '40')}px;
  background: ${p => (p.disabled ? p.theme.colors.lightGrey : p.bg || p.theme.colors.white)};
  border-bottom-left-radius: ${p => (p.flatLeft ? 0 : p.theme.radii[1])}px;
  border-bottom-right-radius: ${p => (p.flatRight ? 0 : p.theme.radii[1])}px;
  border-top-left-radius: ${p => (p.flatLeft ? 0 : p.theme.radii[1])}px;
  border-top-right-radius: ${p => (p.flatRight ? 0 : p.theme.radii[1])}px;
  border: 1px solid ${p => p.theme.colors.fog};
  color: ${p => p.theme.colors.graphite};
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};
  display: flex;
  width: 100%;

  &:focus {
    outline: none;
    ${p =>
      p.disabled
        ? ''
        : `
    border-color: ${p.theme.colors.wallet};
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;`};
  }

  ${p => {
    const c = p.theme.colors.wallet
    return p.fakeFocusRight
      ? `
    border-top: 1px solid ${c};
    border-right: 1px solid ${c};
    border-bottom: 1px solid ${c};
  `
      : ''
  }};
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

const IconSelected = styled(Box).attrs({
  color: 'wallet',
  alignItems: 'center',
  justifyContent: 'center',
})`
  height: 12px;
  width: 12px;
  opacity: ${p => (p.selected ? 1 : 0)};
`

const AngleDown = props => (
  <Box color="grey" alignItems="center" justifyContent="center" {...props}>
    <svg viewBox="0 0 16 16" width="16" height="16">
      <path
        fill="currentColor"
        d="M7.70785815 10.86875l-5.08670521-4.5875c-.16153725-.146875-.16153725-.384375 0-.53125l.68051867-.61875c.16153726-.146875.42274645-.146875.58428371 0L8 8.834375l4.1140447-3.703125c.1615372-.146875.4227464-.146875.5842837 0l.6805187.61875c.1615372.146875.1615372.384375 0 .53125l-5.08670525 4.5875c-.16153726.146875-.42274644.146875-.5842837 0z"
      />
    </svg>
  </Box>
)

const renderSelectedItem = ({ selectedItem, renderSelected, placeholder }: any) =>
  selectedItem && renderSelected ? (
    renderSelected(selectedItem)
  ) : (
    <Text color="fog">{placeholder}</Text>
  )

class Select extends PureComponent<Props> {
  static defaultProps = {
    bg: undefined,
    disabled: false,
    small: false,
    fakeFocusRight: false,
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
                      <IconCheck size={12} />
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
      disabled,
      fakeFocusRight,
      flatLeft,
      flatRight,
      fuseOptions,
      highlight,
      items,
      itemToString,
      onChange,
      placeholder,
      renderHighlight,
      renderSelected,
      searchable,
      value,
      small,
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

          if (disabled) {
            return (
              <Container {...getRootProps({ refKey: 'innerRef' })}>
                <TriggerBtn disabled bg={props.bg} tabIndex={0} small={small}>
                  {renderSelectedItem({ selectedItem, renderSelected, placeholder })}
                </TriggerBtn>
              </Container>
            )
          }

          return (
            <Container
              {...getRootProps({ refKey: 'innerRef' })}
              {...props}
              horizontal
              onKeyDown={() => (this._useKeyboard = true)}
              onKeyUp={() => (this._useKeyboard = false)}
            >
              {searchable ? (
                <Box grow>
                  <Input
                    small
                    keepEvent
                    onClick={openMenu}
                    renderRight={<AngleDown mr={2} />}
                    {...getInputProps({ placeholder })}
                  />
                </Box>
              ) : (
                <TriggerBtn
                  {...getToggleButtonProps()}
                  bg={props.bg}
                  fakeFocusRight={fakeFocusRight}
                  flatLeft={flatLeft}
                  flatRight={flatRight}
                  tabIndex={0}
                  small={small}
                >
                  <Box grow>
                    {renderSelectedItem({ selectedItem, renderSelected, placeholder })}
                  </Box>
                  <AngleDown mr={-1} />
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
