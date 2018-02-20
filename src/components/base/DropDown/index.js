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

const Drop = styled(Box).attrs({
  bg: 'white',
  boxShadow: 0,
  borderRadius: 1,
  p: 2,
})`
  position: absolute;
  top: 100%;
  right: 0;
`

export const DropDownItem = styled(Box).attrs({
  borderRadius: 1,
  justifyContent: 'center',
  ff: p => (p.isActive ? 'Open Sans|SemiBold' : 'Open Sans'),
  fontSize: 4,
  px: 3,
  color: p => (p.isHighlighted || p.isActive ? 'dark' : 'warnGrey'),
  bg: p => (p.isActive ? 'cream' : ''),
})`
  cursor: pointer;
  height: 40px;
  white-space: nowrap;
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
  onChange?: DropDownItemType => void,
  onStateChange?: Function,
  renderItem: Object => any,
  value?: DropDownItemType | null,
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
    const { offsetTop, renderItem } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps

    return (
      <Drop mt={offsetTop}>
        {items.map((item, i) => {
          const { key } = item
          return (
            <Box key={key} {...getItemProps({ item })}>
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
    const { children, items, value, onChange, ...props } = this.props
    return (
      <Downshift
        onChange={onChange}
        stateReducer={this.handleStateChange}
        itemToString={itemToString}
        selectedItem={value}
        render={({
          getButtonProps,
          getRootProps,
          isOpen,
          openMenu,
          selectedItem,
          ...downshiftProps
        }) => (
          <Box {...getRootProps({ refKey: 'innerRef' })} horizontal relative>
            <Trigger {...getButtonProps()} tabIndex={0} {...props}>
              {children}
            </Trigger>
            {isOpen && this.renderItems(items, selectedItem, downshiftProps)}
          </Box>
        )}
      />
    )
  }
}

export default DropDown
