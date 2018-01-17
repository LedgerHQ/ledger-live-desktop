// @flow

import React, { PureComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import { space } from 'styled-system'

import type { Element } from 'react'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Search from 'components/base/Search'

import Triangles from './Triangles'

type Props = {
  items: Array<Object>,
  itemToString: Function,
  onChange: Function,
  fuseOptions?: Object,
  highlight?: boolean,
  searchable?: boolean,
  renderHighlight?: string => Element<*>,
  renderItem?: (*) => Element<*>,
}

const Container = styled(Box).attrs({ relative: true, color: 'steel' })``

const TriggerBtn = styled(Box).attrs({
  p: 2,
})`
  ${space};
  border: 1px solid ${p => p.theme.colors.mouse};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.steel};
  background: ${p => p.theme.colors.white};
  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
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

const Dropdown = styled(Box).attrs({
  mt: 1,
})`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid ${p => p.theme.colors.mouse};
  max-height: 300px;
  overflow-y: auto;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
`

class Select extends PureComponent<Props> {
  renderItems = (items: Array<Object>, downshiftProps: Object) => {
    const { renderItem } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps
    return (
      <Dropdown>
        {items.length ? (
          items.map((item, i) => (
            <ItemWrapper key={item.key} {...getItemProps({ item })}>
              <Item highlighted={i === highlightedIndex}>
                {renderItem ? renderItem(item) : <span>{item.name_highlight || item.name}</span>}
              </Item>
            </ItemWrapper>
          ))
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
      onChange,
    } = this.props

    return (
      <Downshift
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
        }) => (
          <Container {...getRootProps({ refKey: 'innerRef' })}>
            {searchable ? (
              <Input keepEvent {...getInputProps({ placeholder: 'Chess?' })} onClick={openMenu} />
            ) : (
              <TriggerBtn {...getButtonProps()} tabIndex={0} horizontal align="center" flow={2}>
                <Box grow>{renderSelected(selectedItem)}</Box>
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
                  render={items => this.renderItems(items, downshiftProps)}
                />
              ) : (
                this.renderItems(items, downshiftProps)
              ))}
          </Container>
        )}
      />
    )
  }
}

export default Select
