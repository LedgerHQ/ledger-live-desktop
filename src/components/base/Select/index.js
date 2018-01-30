// @flow

import React, { PureComponent } from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'
import { space } from 'styled-system'

import type { Element } from 'react'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'
import Input from 'components/base/Input'
import Search from 'components/base/Search'
import Text from 'components/base/Text'

import Triangles from './Triangles'

type Props = {
  items: Array<any>,
  value?: Object | null,
  itemToString?: Function,
  onChange?: Function,
  fuseOptions?: Object,
  highlight?: boolean,
  searchable?: boolean,
  placeholder?: string,
  renderHighlight?: string => Element<*>,
  renderSelected?: any => Element<*>,
  renderItem?: (*) => Element<*>,
  keyProp?: string,
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
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

const Item = styled(Box).attrs({
  align: 'center',
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

const FloatingTriangles = styled(Box).attrs({
  align: 'center',
  justify: 'center',
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
  align: 'center',
  justify: 'center',
})`
  border-radius: 50%;
  height: 15px;
  font-size: 5px;
  width: 15px;
  opacity: ${p => (p.selected ? 1 : 0)};

  // add top for center icon
  > * {
    top: 1px;
  }
`

class Select extends PureComponent<Props> {
  static defaultProps = {
    itemToString: (item: Object) => item && item.name,
    keyProp: undefined,
  }

  renderItems = (items: Array<Object>, selectedItem: any, downshiftProps: Object) => {
    const { renderItem, keyProp } = this.props
    const { getItemProps, highlightedIndex } = downshiftProps

    return (
      <Dropdown>
        {items.length ? (
          items.map((item, i) => (
            <ItemWrapper key={keyProp ? item[keyProp] : item.key} {...getItemProps({ item })}>
              <Item highlighted={i === highlightedIndex} horizontal flow={10}>
                <Box grow>
                  {renderItem ? renderItem(item) : <span>{item.name_highlight || item.name}</span>}
                </Box>
                <Box>
                  <IconSelected selected={selectedItem === item}>
                    <Icon name="check" />
                  </IconSelected>
                </Box>
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
        }) => (
          <Container {...getRootProps({ refKey: 'innerRef' })} {...props}>
            {searchable ? (
              <Box relative>
                <Input keepEvent {...getInputProps({ placeholder })} onClick={openMenu} />
                <FloatingTriangles>
                  <Triangles />
                </FloatingTriangles>
              </Box>
            ) : (
              <TriggerBtn {...getButtonProps()} tabIndex={0} horizontal align="center" flow={2}>
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
        )}
      />
    )
  }
}

export default Select
