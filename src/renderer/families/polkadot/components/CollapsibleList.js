// @flow
import React, { useState, useCallback } from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import AngleDown from "~/renderer/icons/AngleDown";

const Wrapper = styled.div`
  position: relative;
`;

const ShowMore: ThemedComponent<{ collapsed?: boolean }> = styled(Button)`
  margin: 0;
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 0px 0px 4px 4px;
  height: 32px;
  text-align: center;
  padding: 0;

  &:hover ${Text} {
    text-decoration: underline;
  }
  &:hover {
    background-color: initial;
  }
`;

const IconAngleDown = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${p => (p.collapsed ? "rotate(0deg)" : "rotate(180deg)")};
`;

type Props = {
  children?: React$Node,
  uncollapsedItems: Array<any>,
  collapsedItems: Array<any>,
  renderItem: (item: any, index: number, isLast: boolean) => React$Node,
  renderShowMore: (collapsed: boolean) => React$Node,
};

const CollapsibleList = ({
  children,
  uncollapsedItems,
  collapsedItems,
  renderItem,
  renderShowMore,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(collapsed => !collapsed);
  }, []);

  return (
    <Box p={0}>
      {children}
      <Wrapper>
        {uncollapsedItems.map((item, i) =>
          renderItem(item, i, collapsed && i === uncollapsedItems.length - 1),
        )}
      </Wrapper>
      {collapsedItems.length !== 0 ? (
        <>
          {!collapsed && (
            <Wrapper>
              {collapsedItems.map((item, i) =>
                renderItem(item, i, i === collapsedItems.length - 1),
              )}
            </Wrapper>
          )}
          <ShowMore collapsed={collapsed} onClick={toggleCollapsed}>
            <Box horizontal alignContent="center" justifyContent="center">
              <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
                {renderShowMore(collapsed)}
              </Text>
              <IconAngleDown collapsed={collapsed}>
                <AngleDown size={16} />
              </IconAngleDown>
            </Box>
          </ShowMore>
        </>
      ) : null}
    </Box>
  );
};

export default CollapsibleList;
