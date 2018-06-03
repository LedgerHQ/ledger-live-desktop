// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'

import GrowScroll from 'components/base/GrowScroll'
import Box from 'components/base/Box'
import Space from 'components/base/Space'

import SideBarListItem from './SideBarListItem'

import type { Item } from './SideBarListItem'

type Props = {
  items: Item[],
  title?: Node | string,
  activeValue?: string,
  scroll?: boolean,
  titleRight?: any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
}

class SideBarList extends PureComponent<Props> {
  render() {
    const { items, title, activeValue, scroll, titleRight, ...props } = this.props
    const ListWrapper = scroll ? GrowScroll : Box
    return (
      <Fragment>
        {!!title && (
          <Fragment>
            <SideBarListTitle>
              {title}
              {!!titleRight && <Box ml="auto">{titleRight}</Box>}
            </SideBarListTitle>
            <Space of={10} />
          </Fragment>
        )}
        <ListWrapper flow={2} px={3} fontSize={3} {...props}>
          {items.map(item => {
            const itemProps = {
              item,
              isActive: item.isActive || (!!activeValue && activeValue === item.value),
            }
            return <SideBarListItem key={item.value} {...itemProps} />
          })}
        </ListWrapper>
      </Fragment>
    )
  }
}

const SideBarListTitle = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  color: 'dark',
  ff: 'Museo Sans|ExtraBold',
  fontSize: 1,
  px: 4,
})`
  cursor: default;
  letter-spacing: 2px;
  text-transform: uppercase;
`

export default SideBarList
