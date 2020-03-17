// @flow

import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
import IconHelp from "~/renderer/icons/Help";
import Box from "./Box";
import Label from "./Label";

const Wrapper: ThemedComponent<{}> = styled(Label).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "wallet",
  fontSize: 4,
  alignItems: "center",
}))`
  display: flex;
  cursor: pointer;

  &:hover {
    color: ${p => rgba(p.theme.colors.wallet, 0.9)};
  }
`;

type Props = {
  onClick: ?() => void,
  label?: React$Node,
  children?: React$Node,
  iconSize?: number,
  style?: *,
};

// can add more dynamic options if needed
export function LinkHelp({ onClick, label, children, iconSize = 12, style }: Props) {
  return (
    <Wrapper onClick={onClick} style={style}>
      <Box mr={1}>
        <IconHelp size={iconSize} />
      </Box>
      <span>{label || children}</span>
    </Wrapper>
  );
}

export default LinkHelp;
