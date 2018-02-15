// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import noop from 'lodash/noop'
import Downshift from 'downshift'

import Box from 'components/base/Box'

type ItemType = {
  key: string,
  label: any,
}

type Props = {
  children: any,
  offsetTop: number | string,
  items: Array<ItemType>,
  value?: ItemType | null,
  onChange?: ItemType => void,
}

const Trigger = styled(Box)`
  outline: none;
  cursor: pointer;
`

const Drop = styled(Box).attrs({
  bg: 'white',
  boxShadow: 0,
  borderRadius: 1,
})`
  position: absolute;
  top: 100%;
  right: 0;

  > * + * {
    border-top: 1px solid ${p => p.theme.colors.argile};
  }
`

const Item = styled(Box).attrs({
  py: 2,
  fontSize: 3,
  px: 4,
  bg: p => (p.isHighlighted ? 'pearl' : ''),
})`
  cursor: pointer;
  white-space: nowrap;
`

function itemToString(item) {
  return item ? item.label : ''
}

class DropDown extends PureComponent<Props> {
  static defaultProps = {
    value: null,
    onChange: noop,
    offsetTop: 1,
  }

  renderItems = (items: Array<ItemType>, selectedItem: ItemType, downshiftProps: Object) => {
    const { offsetTop } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps

    return (
      <Drop mt={offsetTop}>
        {items.map((item, i) => {
          const { key, label, ...props } = item
          return (
            <Item
              isHighlighted={highlightedIndex === i}
              key={item.key}
              {...getItemProps({ item })}
              {...props}
            >
              {item.label}
            </Item>
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
