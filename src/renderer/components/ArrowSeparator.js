// @flow

import React from "react";
import styled from "styled-components";
import IconTransfer from "~/renderer/icons/Transfer";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const ArrowSeparatorWrapper: ThemedComponent<{ horizontal: boolean }> = styled.div`
  display: flex;
  flex-direction: ${p => (p.horizontal ? "row" : "column")};
  align-items: center;
  & > div {
    flex: 1;
    ${p => (p.horizontal ? "height" : "width")}: 1px;
    background: ${p => p.theme.colors.palette.divider};
    &:nth-of-type(2) {
      color: ${p => p.theme.colors.palette.primary.main};
      flex: unset;
      display: flex;
      align-items: center;
      height: 36px;
      width: 36px;
      border-radius: 36px;
      background: transparent;
      justify-content: center;
      border: 1px solid ${p => p.theme.colors.palette.divider};
    }
  }
`;

const ArrowSeparator = ({
  onClick,
  horizontal,
  Icon = IconTransfer,
  size = 16,
}: {
  onClick?: () => any,
  horizontal?: boolean,
  Icon?: any,
  size?: number,
}) => (
  <ArrowSeparatorWrapper horizontal={!!horizontal} onClick={onClick}>
    <div />
    <div>
      <Icon size={size} />
    </div>
    <div />
  </ArrowSeparatorWrapper>
);

export default ArrowSeparator;
