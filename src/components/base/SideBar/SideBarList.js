// @flow

import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import GrowScroll from 'components/base/GrowScroll'
import Box from 'components/base/Box'
import Space from 'components/base/Space'

type Props = {
  children: any,
  title?: React$Node,
  scroll?: boolean,
  titleRight?: any,
  emptyState?: any,
}

class SideBarList extends Component<Props> {
  render() {
    const { children, title, scroll, titleRight, emptyState, ...props } = this.props
    const ListWrapper = scroll ? GrowScroll : Box
    return (
      <Fragment>
        {!!title && (
          <Fragment>
            <SideBarListTitle>
              {title}
              {!!titleRight && <Box ml="auto">{titleRight}</Box>}
            </SideBarListTitle>
            <Space of={20} />
          </Fragment>
        )}
        {children && children.length ? (
          <ListWrapper flow={2} px={3} fontSize={3} {...props}>
            {children}
          </ListWrapper>
        ) : emptyState ? (
          <Box px={4} ff="Open Sans|Regular" selectable fontSize={3} color="grey">
            {emptyState}
          </Box>
        ) : null}
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
