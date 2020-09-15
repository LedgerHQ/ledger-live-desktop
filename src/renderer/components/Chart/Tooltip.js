// @flow

import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import type { Item } from "./types";

const Container = styled(Box).attrs(() => ({
  px: 4,
  py: 3,
  alignItems: "center",
}))`
  background: ${p => p.theme.colors.palette.background.paper};
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
  width: 150px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
  text-align: center;
`;

const Tooltip = ({ item, renderTooltip }: { item: Item, renderTooltip: Item => * }) => (
  <div style={{ position: "relative" }}>
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        transform: "translate3d(-50%, 0, 0)",
        whiteSpace: "nowrap",
        marginBottom: -5,
      }}
    >
      <Container>{renderTooltip(item)}</Container>
    </div>
  </div>
);

export default Tooltip;
