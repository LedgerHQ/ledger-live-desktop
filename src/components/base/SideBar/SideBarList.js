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
  collapsed?: boolean,
}

class SideBarList extends Component<Props> {
  render() {
    const { children, title, scroll, titleRight, emptyState, collapsed, ...props } = this.props
    const ListWrapper = scroll ? GrowScroll : Box

    return (
      <Fragment>
        {!!title && (
          <Fragment>
            <SideBarListTitle collapsed={collapsed}>
              {title}
              {!!titleRight && <Box ml="auto">{titleRight}</Box>}
            </SideBarListTitle>
            <Space of={20} />
          </Fragment>
        )}
        {children ? (
          <ListWrapper flow={2} px={3} fontSize={3} {...props}>
            {children}
          </ListWrapper>
        ) : emptyState ? (
          <Box px={4} ff="Inter|Regular" selectable fontSize={3} color="palette.text.shade60">
            {emptyState}
          </Box>
        ) : null}
      </Fragment>
    )
  }
}

const SideBarListTitle = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  color: 'palette.text.shade100',
  ff: 'Inter|ExtraBold',
  fontSize: 1,
  px: 4,
}))`
  cursor: default;
  letter-spacing: 2px;
  text-transform: uppercase;

  // allow collapsing
  opacity: ${p => (p.collapsed ? 0 : 1)};
  transition: opacity 0.15s;
  overflow: hidden;
  white-space: nowrap;
`

export default SideBarList
