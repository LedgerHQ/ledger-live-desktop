// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import IconExternalLink from "~/renderer/icons/ExternalLink";

import Label from "./Label";

const Wrapper: ThemedComponent<{}> = styled(Label).attrs(props => ({
  ff: "Inter|SemiBold",
  color: props.black ? props.theme.colors.palette.text.shade100 : "wallet",
  fontSize: props.fontSize,
  alignItems: "center",
}))`
  display: flex;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

type Props = {
  onClick: ?() => void,
  label?: React$Node,
  children?: React$Node,
  style?: *,
  fontSize?: number,
  black?: boolean,
};

// can add more dynamic options if needed
export function LinkWithExternalIcon({ onClick, label, children, style, fontSize, black }: Props) {
  return (
    <Wrapper black={black} onClick={onClick} style={style} fontSize={fontSize || 4}>
      <span>{label || children}</span>
      <Box ml={1}>
        <IconExternalLink size={12} />
      </Box>
    </Wrapper>
  );
}

export default LinkWithExternalIcon;
