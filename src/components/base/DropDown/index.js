// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import noop from 'lodash/noop'
import Downshift from 'downshift'

import Box from 'components/base/Box'

const Trigger = styled(Box)`
  outline: none;
  cursor: pointer;
`

const Drop = styled(Box).attrs(() => ({
  bg: 'palette.background.paper',
  boxShadow: 0,
  borderRadius: 1,
  p: 2,
}))`
  border: ${p => (p.border ? `1px solid ${p.theme.colors.palette.divider}` : 'none')};
  max-height: 400px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
  overflow: scroll;
`

export const DropDownItem = styled(Box).attrs(p => ({
  borderRadius: 1,
  justifyContent: 'center',
  ff: p.isActive ? 'Inter|SemiBold' : 'Inter',
  fontSize: 4,
  px: 3,
  color: p.isHighlighted || p.isActive ? 'palette.text.shade100' : 'palette.text.shade80',
  bg: p.isActive ? 'palette.background.default' : '',
}))`
  height: 40px;
  white-space: nowrap;
`

export const Wrapper = styled(Box)`
  flex-shrink: 1;
  ${p => p.shrink && `flex-shrink:${p.shrink};`}
`
function itemToString(item) {
  return item ? item.label : ''
}

export type DropDownItemType = {
  key: string,
  label: any,
}

type Props = {
  children: any,
  items: Array<DropDownItemType>,
  keepOpenOnChange?: boolean,
  offsetTop: number | string,
  border?: boolean,
  onChange?: DropDownItemType => void,
  onStateChange?: Function,
  renderItem: Object => any,
  value?: DropDownItemType | null,
  shrink?: string,
}

class DropDown extends PureComponent<Props> {
  static defaultProps = {
    keepOpenOnChange: false,
    value: null,
    onChange: noop,
    onStateChange: noop,
    offsetTop: 1,
    renderItem: ({
      item,
      isHighlighted,
      isActive,
    }: {
      item: DropDownItemType,
      isHighlighted: boolean,
      isActive: boolean,
    }) => (
      <DropDownItem isHighlighted={isHighlighted} isActive={isActive}>
        {item.label}
      </DropDownItem>
    ),
  }

  handleStateChange = (state: Object, changes: Object) => {
    const { keepOpenOnChange, onStateChange } = this.props

    if (onStateChange) {
      onStateChange(changes)
    }

    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEscape:
      case Downshift.stateChangeTypes.mouseUp:
      case Downshift.stateChangeTypes.clickButton:
        return changes

      case Downshift.stateChangeTypes.keyDownEnter:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
        }

      default:
        return {
          ...changes,
          ...(keepOpenOnChange
            ? {
                isOpen: true,
              }
            : {}),
        }
    }
  }

  renderItems = (
    items: Array<DropDownItemType>,
    selectedItem: DropDownItemType,
    downshiftProps: Object,
  ) => {
    const { offsetTop, renderItem, border } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps

    return (
      <Drop mt={offsetTop} border={border}>
        {items.map((item, i) => {
          const { key, ...props } = item
          return (
            <Box key={key} {...getItemProps({ item })} {...props}>
              {renderItem({
                item,
                isHighlighted: highlightedIndex === i,
                isActive: item === selectedItem,
              })}
            </Box>
          )
        })}
      </Drop>
    )
  }

  render() {
    const { children, items, value, onChange, shrink, ...props } = this.props
    return (
      <Downshift
        onChange={onChange}
        stateReducer={this.handleStateChange}
        itemToString={itemToString}
        selectedItem={value}
        render={({
          getToggleButtonProps,
          getRootProps,
          isOpen,
          openMenu,
          selectedItem,
          ...downshiftProps
        }) => (
          <Wrapper
            shrink={shrink}
            {...getRootProps({ refKey: 'ref' }, { suppressRefError: true })}
            horizontal
            relative
          >
            <Trigger {...getToggleButtonProps()} tabIndex={0} {...props}>
              {children}
            </Trigger>
            {isOpen && this.renderItems(items, selectedItem, downshiftProps)}
          </Wrapper>
        )}
      />
    )
  }
}

export default DropDown
