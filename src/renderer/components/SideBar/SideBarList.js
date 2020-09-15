// @flow

import React, { Component } from "react";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Space from "~/renderer/components/Space";

/**
 * when collapsed =>
 * Hack to allocate an extension of space on the right for the tooltips
 * !important to keep track color hidden
 **/
const ListWrapper = styled(Box)`
  ${p => (p.scroll ? p.theme.overflow.y : "")};
  ${p => (p.scroll ? "padding-right: 2px" : "")};
  will-change: unset;
  ${p =>
    p.collapsed
      ? `
    padding-right: ${p.scroll ? 200 - p.theme.overflow.trackSize : 200}px; 
    margin-right: -${200 - p.theme.overflow.trackSize}px;
    --track-color: rgba(0,0,0,0)!important;
  `
      : ""};
`;

type Props = {
  children: any,
  title?: React$Node,
  scroll?: boolean,
  titleRight?: any,
  emptyState?: any,
  collapsed?: boolean,
  flex?: string,
};

class SideBarList extends Component<Props> {
  render() {
    const {
      children,
      title,
      scroll,
      titleRight,
      emptyState,
      collapsed,
      flex = "auto",
    } = this.props;

    return (
      <>
        {!!title && (
          <>
            <SideBarListTitle collapsed={collapsed}>
              {title}
              {!!titleRight && <Box ml="auto">{titleRight}</Box>}
            </SideBarListTitle>
            <Space of={20} />
          </>
        )}
        {children ? (
          <ListWrapper
            collapsed={collapsed}
            scroll={scroll}
            flow={2}
            px={3}
            fontSize={3}
            flex={flex}
          >
            {children}
          </ListWrapper>
        ) : emptyState ? (
          <Box px={4} ff="Inter|Regular" selectable fontSize={3} color="palette.text.shade60">
            {emptyState}
          </Box>
        ) : null}
      </>
    );
  }
}

const SideBarListTitle = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  color: "palette.text.shade100",
  ff: "Inter|ExtraBold",
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
`;

export default SideBarList;
